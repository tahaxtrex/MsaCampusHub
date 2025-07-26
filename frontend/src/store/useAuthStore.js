import {create} from "zustand"


export const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    
    isCheckingAuth: true,

    checkAuth: async () => {
       

    },

    signup: async (data) => {
        
        
    },

    login: async (data) => {

    },

}))