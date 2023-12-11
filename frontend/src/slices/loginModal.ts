import { createSlice } from "@reduxjs/toolkit"

interface  LoginModalProps{
    isLoginModalOpen : boolean
}

const initialState: LoginModalProps = {
    isLoginModalOpen:false
}

const loginModalSlice = createSlice({
    name: "toggleLoginModal",
    initialState,
    reducers:{
        openLoginModal: (state)=>{
            state.isLoginModalOpen= true
        },
        closeLoginModal : (state)=>{
            state.isLoginModalOpen= false
        }
    }

})

export const {openLoginModal,closeLoginModal} = loginModalSlice.actions
export default loginModalSlice.reducer