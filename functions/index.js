// SnapQuant Firebase Functions - Polar 웹훅 수신 엔드포인트
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { Webhook } = require("standardwebhooks");

admin.initializeApp();
const db = admin.firestore();

// Polar 웹훅 시크릿 (Firebase Functions 환경변수에서 로드)
const WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET || "";

/**
 * Polar 웹훅 수신 엔드포인트
 * 구독 이벤트를 받아 Firestore 사용자 데이터 업데이트
 */
exports.polarWebhook = onRequest(
    { cors: false, region: "us-central1" },
    async (req, res) => {
        // POST만 허용
        if (req.method !== "POST") {
            res.status(405).send("Method Not Allowed");
            return;
        }

        // 웹훅 서명 검증
        try {
            if (WEBHOOK_SECRET) {
                const wh = new Webhook(WEBHOOK_SECRET);
                wh.verify(JSON.stringify(req.body), {
                    "webhook-id": req.headers["webhook-id"],
                    "webhook-timestamp": req.headers["webhook-timestamp"],
                    "webhook-signature": req.headers["webhook-signature"],
                });
            }
        } catch (err) {
            console.error("웹훅 서명 검증 실패:", err.message);
            res.status(401).send("서명 검증 실패");
            return;
        }

        const { type, data } = req.body;

        // 고객 이메일 추출
        const customerEmail =
            data?.customer?.email ||
            data?.subscription?.customer?.email ||
            data?.email ||
            null;

        if (!customerEmail) {
            console.warn("고객 이메일 없음:", type);
            res.status(200).send("OK (이메일 없음)");
            return;
        }

        console.log(`[Polar 웹훅] 이벤트: ${type}, 이메일: ${customerEmail}`);

        try {
            // 이메일로 Firestore 사용자 검색
            const usersRef = db.collection("users");
            const snapshot = await usersRef
                .where("email", "==", customerEmail)
                .limit(1)
                .get();

            if (snapshot.empty) {
                console.warn(`사용자를 찾을 수 없음: ${customerEmail}`);
                res.status(200).send("OK (사용자 미발견)");
                return;
            }

            const userDoc = snapshot.docs[0];
            const userId = userDoc.id;

            // 이벤트 타입별 처리
            switch (type) {
                case "subscription.created":
                case "subscription.active":
                case "subscription.updated": {
                    const status = data?.subscription?.status || data?.status;

                    if (status === "active") {
                        // 구독 활성화 → Pro 티어 설정
                        const currentPeriodEnd =
                            data?.subscription?.current_period_end ||
                            data?.current_period_end;

                        await usersRef.doc(userId).set(
                            {
                                tier: "pro",
                                subscriptionStatus: "active",
                                subscriptionId:
                                    data?.subscription?.id || data?.id || null,
                                subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
                                currentPeriodEnd: currentPeriodEnd || null,
                                lastWebhookEvent: type,
                                lastWebhookAt: admin.firestore.FieldValue.serverTimestamp(),
                            },
                            { merge: true }
                        );

                        console.log(`✅ Pro 활성화: ${customerEmail} (${userId})`);
                    }
                    break;
                }

                case "subscription.canceled":
                case "subscription.revoked": {
                    // 구독 취소/해지 → Starter 티어로 변경
                    await usersRef.doc(userId).set(
                        {
                            tier: "starter",
                            subscriptionStatus: "canceled",
                            canceledAt: admin.firestore.FieldValue.serverTimestamp(),
                            lastWebhookEvent: type,
                            lastWebhookAt: admin.firestore.FieldValue.serverTimestamp(),
                        },
                        { merge: true }
                    );

                    console.log(`⚠️ 구독 취소: ${customerEmail} (${userId})`);
                    break;
                }

                default:
                    console.log(`미처리 이벤트: ${type}`);
            }

            res.status(200).send("OK");
        } catch (err) {
            console.error("웹훅 처리 오류:", err);
            res.status(500).send("서버 오류");
        }
    }
);
