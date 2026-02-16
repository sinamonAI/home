import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase.config';

export type UserTier = 'starter' | 'pro' | null;
export type ConsoleTheme = 'dark' | 'light';

// 구독 정보 타입
export interface SubscriptionData {
    tier: UserTier;
    checkoutId?: string;
    subscribedAt?: string;
    expiresAt?: string;
    status?: 'active' | 'canceled' | 'expired';
}

// 사용자 티어 조회
export async function getUserTier(uid: string): Promise<UserTier> {
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
            // 만료일 확인
            const data = snap.data();
            if (data.tier === 'pro' && data.expiresAt) {
                const now = new Date();
                const expiry = new Date(data.expiresAt);
                if (now > expiry) {
                    // 구독 만료 → starter로 변경
                    await setDoc(doc(db, 'users', uid), {
                        tier: 'starter',
                        status: 'expired'
                    }, { merge: true });
                    return 'starter';
                }
            }
            return (data.tier as UserTier) || null;
        }
        return null;
    } catch (e) {
        console.error('티어 조회 실패:', e);
        return null;
    }
}

// 사용자 티어 설정
export async function setUserTier(uid: string, tier: 'starter' | 'pro'): Promise<void> {
    try {
        await setDoc(doc(db, 'users', uid), { tier }, { merge: true });
    } catch (e) {
        console.error('티어 설정 실패:', e);
    }
}

// 구독 정보 저장 (결제 성공 시)
export async function saveSubscription(uid: string, data: {
    checkoutId: string;
    tier: 'pro';
}): Promise<void> {
    try {
        const now = new Date();
        // 구독 시작일 기준 30일 후 만료
        const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        await setDoc(doc(db, 'users', uid), {
            tier: data.tier,
            checkoutId: data.checkoutId,
            subscribedAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            status: 'active',
        }, { merge: true });
    } catch (e) {
        console.error('구독 정보 저장 실패:', e);
    }
}

// 구독 활성 상태 확인
export async function isSubscriptionActive(uid: string): Promise<boolean> {
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (!snap.exists()) return false;

        const data = snap.data();
        if (data.tier !== 'pro') return false;

        // 만료일 확인
        if (data.expiresAt) {
            return new Date() < new Date(data.expiresAt);
        }

        // 만료일 없으면 활성으로 간주
        return true;
    } catch (e) {
        console.error('구독 상태 확인 실패:', e);
        return false;
    }
}

// 테마 조회
export async function getUserTheme(uid: string): Promise<ConsoleTheme> {
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists() && snap.data().consoleTheme) {
            return snap.data().consoleTheme as ConsoleTheme;
        }
        return 'dark';
    } catch (e) {
        console.error('테마 조회 실패:', e);
        return 'dark';
    }
}

// 테마 설정
export async function setUserTheme(uid: string, theme: ConsoleTheme): Promise<void> {
    try {
        await setDoc(doc(db, 'users', uid), { consoleTheme: theme }, { merge: true });
    } catch (e) {
        console.error('테마 설정 실패:', e);
    }
}
