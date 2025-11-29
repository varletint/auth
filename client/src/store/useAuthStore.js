import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            currentUser: null,
            error: null,
            loading: false,

            signInStart: () => set({ loading: true, error: null }),
            signInSuccess: (user) =>
                set({ currentUser: user, loading: false, error: null }),
            signInFailure: (error) => set({ loading: false, error }),
            signOut: async () => {
                try {
                    const res = await fetch('/api/auth/signout');
                    if (res.ok) {
                        set({ currentUser: null, loading: false, error: null });
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                    // Still clear state even if API call fails
                    set({ currentUser: null, loading: false, error: null });
                }
            },
            updateUser: (userData) => set({ currentUser: userData }),
        }),
        {
            name: "auth-storage", // unique name for localStorage
        }
    )
);

export default useAuthStore;
