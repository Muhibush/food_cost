import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile } from '../../../types';
import { idbStorage } from '../../../utils/storageUtils';

interface ProfileState {
    profile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => void;
    resetProfile: () => void;
}

const defaultProfile: UserProfile = {
    name: 'Thomas Chef',
    username: 'thomas_chef',
    description: 'Head Chef at La Bistro.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtKh_wtIoQQkw7stwg6_dUbYwzRyj2JDYeuICxZ5vfvLYDunXRddDZNvt_PJrG_5LBOCORVFSs2vBYKeFDEWhZepFLX7ZWPedAVfpfZhov945Uni5JvkmStFuABKLhQ-jD1maP_jIpf9dV49Qk3YtkyQ4eOCI3oI6ttqN3o7anDnjg4eDU9QZ5-rImasTSSrfEkhK6eORC-six3CmewhQiV8-4Vegqbu3ZTOyQ4-03cdyJU69S23LB_zJaVpeqwdHqVOgOadH4CWM'
};

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            profile: defaultProfile,
            updateProfile: (updates) =>
                set((state) => ({
                    profile: { ...state.profile, ...updates },
                })),
            resetProfile: () => set({ profile: defaultProfile }),
        }),
        {
            name: 'food-cost-profile',
            storage: createJSONStorage(() => idbStorage),
        }
    )
);
