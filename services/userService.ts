import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase.config';

export type UserTier = 'starter' | 'pro' | null;

export async function getUserTier(uid: string): Promise<UserTier> {
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
            return (snap.data().tier as UserTier) || null;
        }
        return null;
    } catch (e) {
        console.error('Failed to get user tier:', e);
        return null;
    }
}

export async function setUserTier(uid: string, tier: 'starter' | 'pro'): Promise<void> {
    try {
        await setDoc(doc(db, 'users', uid), { tier }, { merge: true });
    } catch (e) {
        console.error('Failed to set user tier:', e);
    }
}
