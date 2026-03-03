import { create } from 'zustand';
import { UserProfile } from '../../../types';
import { db, auth } from '../../../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { sanitizeData } from '../../../utils/sanitize';

interface ProfileState {
    profile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    resetProfile: () => void;
    initListener: (firebaseUser: any) => () => void;
}

const defaultProfile: UserProfile = {
    name: 'Thomas Chef',
    username: 'thomas_chef',
    description: 'Head Chef at La Bistro.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtKh_wtIoQQkw7stwg6_dUbYwzRyj2JDYeuICxZ5vfvLYDunXRddDZNvt_PJrG_5LBOCORVFSs2vBYKeFDEWhZepFLX7ZWPedAVfpfZhov945Uni5JvkmStFuABKLhQ-jD1maP_jIpf9dV49Qk3YtkyQ4eOCI3oI6ttqN3o7anDnjg4eDU9QZ5-rImasTSSrfEkhK6eORC-six3CmewhQiV8-4Vegqbu3ZTOyQ4-03cdyJU69S23LB_zJaVpeqwdHqVOgOadH4CWM'
};

export const useProfileStore = create<ProfileState>((set, get) => ({
    profile: defaultProfile,
    updateProfile: async (updates) => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const newProfile = { ...get().profile, ...updates };
        const docRef = doc(db, `users`, uid);
        await setDoc(docRef, sanitizeData(newProfile), { merge: true });
    },
    resetProfile: () => set({ profile: defaultProfile }),
    initListener: (firebaseUser) => {
        const uid = firebaseUser?.uid;
        if (!uid) return () => { };
        const docRef = doc(db, `users`, uid);
        const unsubscribe = onSnapshot(docRef, async (docSnap) => {
            if (docSnap.exists()) {
                set({ profile: docSnap.data() as UserProfile });
            } else {
                // If profile doesn't exist, create it from Firebase user data
                const initialProfile: UserProfile = {
                    name: firebaseUser.displayName || 'Thomas Chef',
                    username: firebaseUser.email?.split('@')[0] || 'chef',
                    description: 'Professional Chef',
                    avatar: firebaseUser.photoURL || defaultProfile.avatar
                };
                set({ profile: initialProfile });
                await setDoc(docRef, sanitizeData(initialProfile));
            }
        });
        return unsubscribe;
    }
}));
