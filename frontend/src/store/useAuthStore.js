import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"



export const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,


    checkAuth: async () => {
       set({isCheckingAuth: true})
        try {
            const res = await axiosInstance.get('/api/auth/check');
            set({authUser: res.data.user})
        } catch (error) {
            set({authUser:null})
            console.log('checking auth error : ', error);
        }finally{
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        set({isSigningUp: true})
        try {
            const res = await axiosInstance.post('/api/auth/signup', data);
            const { username, _id, email } = res.data;
            set({authUser: { username, _id, email }})
            
        } catch (error) {
            console.error("Signup failed:", error);
        }finally{
            set({isSigningUp: false})
        }
        
    },

    login: async (data) => {
        set({isLoggingIn: true})
        try {
            const res = await axiosInstance.post('/api/auth/login', data);
            const { username, _id, email} = res.data;
            set({authUser: { username, _id, email }})
            
        } catch (error) {
            console.error("Login failed:", error);
        }finally{
            set({isLoggingIn: false})
        }
    },

}))