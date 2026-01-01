import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { login, getUserInfo } from '@/api/auth';

interface AuthState {
    token: string | null;
    user: any | null;
    isAuthenticated: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isAuthenticated: false,

            login: async (credentials) => {
                const res: any = await login(credentials);
                if (res.code === 200) {
                    const { access_token } = res.data;
                    set({ token: access_token, isAuthenticated: true });

                    // After login, fetch user info
                    await get().fetchUser();
                } else {
                    throw new Error(res.message || 'Login failed');
                }
            },

            logout: () => {
                set({ token: null, user: null, isAuthenticated: false });
                localStorage.removeItem('token'); // Clear token from storage if managed manually too
            },

            fetchUser: async () => {
                try {
                    const res: any = await getUserInfo();
                    if (res.code === 200) {
                        set({ user: res.data });
                    }
                } catch (error) {
                    console.error("Failed to fetch user info", error);
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
