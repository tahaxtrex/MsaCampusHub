import { create } from "zustand";
import { supabase } from "../lib/supabase.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Fetch profile data including is_admin and points
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                set({ authUser: { ...session.user, ...profile } });
            } else {
                set({ authUser: null });
            }
        } catch (error) {
            console.error("Error checking auth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        username: data.username,
                        avatar_url: "", // Default or random avatar could be set here
                    },
                },
            });

            if (error) throw error;
            toast.success("Account created successfully! Please log in.");

            // Auto login is handled by Supabase usually, but we might need to wait for session
            // For now, let's just notify success.

        } catch (error) {
            console.error("Signup failed:", error);
            toast.error(error.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) throw error;

            // Fetch profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            set({ authUser: { ...authData.user, ...profile } });
            toast.success("Logged in successfully");
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(error.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfilePicture: async (avatarUrl) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: avatarUrl })
                .eq('id', session.user.id);

            if (error) throw error;

            // Refresh auth user data
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            set({ authUser: { ...session.user, ...profile } });
            return true;
        } catch (error) {
            console.error("Failed to update profile picture:", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await supabase.auth.signOut();
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error(error.message);
        }
    },
}));