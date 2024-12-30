import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer"
import postReducer from "./reducer/postReducer";
/**
 * STEPS for state management
 * submit action
 * Handle acion in its reducer
 * Register here ->Reducer
 * 
 * 
 * 
 * */


 

export const store = configureStore({
    reducer:{
        auth : authReducer,
        post : postReducer
    }
})