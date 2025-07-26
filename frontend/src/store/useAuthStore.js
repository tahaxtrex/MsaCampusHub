import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"


export const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    
    isCheckingAuth: true,

    checkAuth: async () => {
       
        try {
            const res = await axiosInstance('/api/auth/check');
            set({authUser: res.data.user})
        } catch (error) {
            set({authUser:null})
            console.log('checking auth error : ', error)
        }finally{
            set({isCheckingAuth: false})
        }
    },

    signup: async (data) => {
        
        
    },

    login: async (data) => {

    },

}))