import { doc, getDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase.config';
import { deleteUser, User } from 'firebase/auth';

export type UserTier = 'starter' | 'pro' | null;

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

// 회원 탈퇴 — Firestore 데이터 삭제 + Firebase Auth 계정 삭제
// Polar 정기결제는 이메일 기반이므로 별도 취소 안내 필요
export async function deleteUserAccount(user: User, retryCount = 0): Promise<{ success: boolean; error?: string }> {
    const MAX_RETRIES = 3;

    try {
        // 1단계: Firestore 사용자 문서 삭제
        await deleteDoc(doc(db, 'users', user.uid));
        console.log('Firestore 사용자 데이터 삭제 완료');

        // 2단계: Firebase Auth 계정 삭제
        await deleteUser(user);
        console.log('Firebase Auth 계정 삭제 완료');

        return { success: true };
    } catch (error: any) {
        console.error(`계정 삭제 오류 (시도 ${retryCount + 1}/${MAX_RETRIES}):`, error);

        // 재인증이 필요한 경우 (오래된 세션)
        if (error.code === 'auth/requires-recent-login') {
            return {
                success: false,
                error: '보안을 위해 최근 로그인이 필요합니다. 로그아웃 후 다시 로그인한 뒤 탈퇴해주세요.'
            };
        }

        // 재시도 로직 (지수 백오프)
        if (retryCount < MAX_RETRIES - 1) {
            const delay = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return deleteUserAccount(user, retryCount + 1);
        }

        return {
            success: false,
            error: '계정 삭제 중 오류가 발생했습니다. support@snapquant.io로 문의해주세요.'
        };
    }
}
