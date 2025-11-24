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
            signOut: () => set({ currentUser: null, loading: false, error: null }),
        }),
        {
            name: "auth-storage", // unique name for localStorage
        }
    )
);

export default useAuthStore;
