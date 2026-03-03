import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
    hasBeenSeeded: boolean;
    setHasBeenSeeded: (value: boolean) => void;
    hasSeenIntro: boolean;
    setHasSeenIntro: (value: boolean) => void;
    resetConfig: () => void;
}

export const useConfigStore = create<ConfigState>()(
    persist(
        (set) => ({
            hasBeenSeeded: false,
            setHasBeenSeeded: (value) => set({ hasBeenSeeded: value }),
            hasSeenIntro: false,
            setHasSeenIntro: (value) => set({ hasSeenIntro: value }),
            resetConfig: () => set({ hasBeenSeeded: false, hasSeenIntro: false }),
        }),
        {
            name: 'food-cost-config',
        }
    )
);
