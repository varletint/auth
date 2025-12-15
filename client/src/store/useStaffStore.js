import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStaffStore = create(
    persist(
        (set, get) => ({
            currentStaff: null,
            isStaffAuthenticated: false,

            // Set staff after successful login
            staffSignIn: (staffData) => {
                set({
                    currentStaff: staffData,
                    isStaffAuthenticated: true,
                });
            },

            // Clear staff session on logout
            staffSignOut: () => {
                set({
                    currentStaff: null,
                    isStaffAuthenticated: false,
                });
            },

            // Update staff data
            updateStaff: (staffData) => {
                set({
                    currentStaff: { ...get().currentStaff, ...staffData },
                });
            },

            // Check if staff has a specific permission
            hasPermission: (permission) => {
                const staff = get().currentStaff;
                if (!staff || !staff.permissions) return false;
                return staff.permissions.includes(permission);
            },

            // Check if staff has any of the required permissions
            hasAnyPermission: (permissions) => {
                const staff = get().currentStaff;
                if (!staff || !staff.permissions) return false;
                return permissions.some((p) => staff.permissions.includes(p));
            },
        }),
        {
            name: 'staff-auth-storage',
            partialize: (state) => ({
                currentStaff: state.currentStaff,
                isStaffAuthenticated: state.isStaffAuthenticated,
            }),
        }
    )
);

export default useStaffStore;
