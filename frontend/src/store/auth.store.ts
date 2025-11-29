import { AuthResponse } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: AuthResponse["user"] | null;
    isAuthenticated: boolean;

    // actions
    setAuth: (data: AuthResponse) => void;
    updateAccessToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,

            setAuth: (data) =>
                set({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: data.user,
                    isAuthenticated: true,
                }),

            updateAccessToken: (token) =>
                set({
                    accessToken: token,
                }),

            logout: () =>
                set({
                    accessToken: null,
                    refreshToken: null,
                    user: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage), // Client-side only
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                user: state.user,
            }),
        }
    )
);
