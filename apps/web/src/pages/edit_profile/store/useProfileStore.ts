import { create } from 'zustand';
import { UserProfile } from '../../../types';
import { db, auth } from '../../../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

interface ProfileState {
    profile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    resetProfile: () => void;
    initListener: () => () => void;
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
        await setDoc(docRef, newProfile, { merge: true });
    },
    resetProfile: () => set({ profile: defaultProfile }),
    initListener: () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return () => { };
        const docRef = doc(db, `users`, uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                set({ profile: docSnap.data() as UserProfile });
            } else {
                set({ profile: defaultProfile });
                setDoc(docRef, defaultProfile);
            }
        });
        return unsubscribe;
    }
}));
