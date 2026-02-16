import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase.config';

export type UserTier = 'starter' | 'pro' | null;
export type ConsoleTheme = 'dark' | 'light';

// 구독 상태 타입
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | null;

// 사용자 티어 조회
export async function getUserTier(uid: string): Promise<UserTier> {
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
            return (snap.data().tier as UserTier) || null;
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

// 사용자 이메일 저장 (웹훅 매칭용)
export async function saveUserEmail(uid: string, email: string): Promise<void> {
    try {
        await setDoc(doc(db, 'users', uid), { email }, { merge: true });
    } catch (e) {
        console.error('이메일 저장 실패:', e);
    }
}

// Firestore 실시간 구독 리스너
// tier 변경 시 콜백 호출 (Polar 웹훅으로 변경된 값을 실시간 감지)
export function subscribeToUserData(
    uid: string,
    onChange: (data: { tier: UserTier; subscriptionStatus: SubscriptionStatus }) => void
): () => void {
    const unsubscribe = onSnapshot(doc(db, 'users', uid), (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            onChange({
                tier: (data.tier as UserTier) || null,
                subscriptionStatus: (data.subscriptionStatus as SubscriptionStatus) || null,
            });
        }
    }, (error) => {
        console.error('실시간 리스너 오류:', error);
    });

    return unsubscribe;
}

// 구독 정보 저장 (결제 성공 시)
export async function saveSubscription(uid: string, data: {
    checkoutId: string;
    tier: 'pro';
}): Promise<void> {
    try {
        await setDoc(doc(db, 'users', uid), {
            tier: data.tier,
            checkoutId: data.checkoutId,
            subscribedAt: new Date().toISOString(),
            subscriptionStatus: 'active',
        }, { merge: true });
    } catch (e) {
        console.error('구독 정보 저장 실패:', e);
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
