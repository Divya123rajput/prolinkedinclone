import { createSlice} from "@reduxjs/toolkit"
import {getAllUsers, getConnectionRequest, getMyConnectionRequests, loginUser , registerUser} from "../../action/authAction"
import { getAboutUser } from "../../action/authAction"



const initialState = {
    user:undefined,
    isError:false, 
    isSuccess:false,
    isLoading:false,
    loggedIn: false,
    message:"",
    isTokenThere: false,
    profileFetched:false,
    connections:[],
    connectionRequest:[],
    all_users:[],
    all_profiles_fetched:false
}


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        reset:()=>initialState,
            handleLoginUser:(state)=>{
           state.message = "hello"
            },

            emptyMessage:(state)=>{
                     state.message=""
            },

            setTokenIsThere:(state)=>{
                state.isTokenThere=true
            },
             setTokenIsNotThere:(state)=>{
                state.isTokenThere=false
             }
        
    },

    extraReducers: (builder)=>{

        builder
        .addCase(loginUser.pending,(state)=>{
            state.isLoading=true,
            state.message = "knocking the door"
        })



        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading = false,
            state.isError= false,
            state.isSuccess = true,
            state.loggedIn = true,
            state.message = "login is successful"
        })



        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading = false,
            state.isError= true,
            state.message =action.payload.connections
        })



        .addCase(registerUser.pending,(state,action)=>{
            state.isLoading = true,
            state.message ="registering you"
        })



        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading = false,
            state.isError= false,
            state.isSuccess = true,
            state.loggedIn = false,
            state.message ={message:"registration is successful , please login"}
          
        })



        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading = false,
            state.isError= true,
            state.message =action.payload
        })



        .addCase(getAboutUser.fulfilled,(state, action) => {
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true; // Fix typo here
            state.user = action.payload; // Assuming payload is the user object
          })



          .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.all_users = action.payload.profiles
            state.all_profiles_fetched = true
          })

          .addCase(getConnectionRequest.fulfilled,(state,action)=>{
            state.connections = action.payload
            
          })


          .addCase(getConnectionRequest.rejected,(state,action)=>{
            state.message = action.payload
          })
         

        .addCase(getMyConnectionRequests.fulfilled,(state,action)=>{
            state.connectionRequest = action.payload
          

        })

        .addCase(getMyConnectionRequests.rejected,(state,action)=>{
            state.message = action.payload

        })

        
    }

    
})


export const {reset,emptyMessage,setTokenIsThere,setTokenIsNotThere} = authSlice.actions

export default authSlice.reducer