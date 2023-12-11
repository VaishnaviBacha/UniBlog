import { configureStore}from "@reduxjs/toolkit"
import registerModalReducer from "./slices/registerModalSlice";
import loginModalReducer from "./slices/loginModal";
import authReducer from "./slices/authSlice";
import { apiSlice } from "./slices/apiSlice";
import departmentReducer from "./slices/blogsSlice"; // Import the departmentReducer
import blogsStateReducer from "./slices/blogsStateSlice";
import searchReducer from "./slices/searchSlice";
export const store = configureStore({
    reducer:{
        toggleRegisterModal :  registerModalReducer,
        toggleLoginModal:loginModalReducer,
        auth:authReducer,
        department: departmentReducer,
        blog : blogsStateReducer,
        search :searchReducer,


        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware().concat( apiSlice.middleware)
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;