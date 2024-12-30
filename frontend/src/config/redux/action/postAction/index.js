



import { clientserver } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts  = createAsyncThunk(
    "post/getAllPosts",
    async(_, thunkAPI) =>{
        try{
            const response = await clientserver.get('/posts')

            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)



export const createPost = createAsyncThunk(
    "post/createPost",
    async(userData,thunkAPI)=>{
        const {file,body} = userData;
        try{
            const formData = new FormData();
            formData.append('token',localStorage.getItem('token'))
            formData.append("body", body)
            formData.append("media",file)

            const response = await clientserver.post("/post",formData,{
                headers:{
                    "Content-Type": 'multipart/form-data'

                }
            });
         
        

            if(response.status === 200){
                return thunkAPI.fulfillWithValue("post uplaoded")
            }else{
                return thunkAPI.rejectWithValue("post not uploaded")
            }
            
        }catch(error){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)


export const deletePost = createAsyncThunk(
    "post/deletePost",
    async(post_id, thunkAPI) => {

       try{

        const response = await clientserver.delete("/delete_post",{
            data:{
                token: localStorage.getItem("token"),
                post_id: post_id.post_id
            }
        });
        return thunkAPI.fulfillWithValue(response.data)

       } catch(error){
    
        return thunkAPI.rejectWithValue(err.response.data)
       }
    }

)


export const incrementPostLike = createAsyncThunk(
    "post/incrementPostLike",
    async(post,thunkAPI) =>{
        try{

            const response =await clientserver.post("/increment_post_likes",{
                post_id: post.post_id
            })
            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
                
        return thunkAPI.rejectWithValue(err.response.data.message)

        }
    }
)



export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async(postData,thunkAPI)=>{

        try{
            const response = await clientserver.get("/get_comments",{
                params:{
                    post_id:postData.post_id 
                }
            })
            return thunkAPI.fulfillWithValue({comments:response.data,
                                               post_id:postData.post_id
                                                                   })

        }catch(error){
            return thunkAPI.rejectWithValue("something went wrong")
        }
    }
)


export const postComment = createAsyncThunk(
    "post/postComment",
   async (commentData,thunkAPI) => {
        try{
            console.log({
                post_id:commentData.post_id,
                body:commentData.body
            })
            const response = await clientserver.post("/comments",{
                token: localStorage.getItem("token"),
                post_id:commentData.post_id,
                commentBody: commentData.body
            })

            return thunkAPI.fulfillWithValue(response.data)
        }catch(error){
            return thunkAPI.rejectWithValue("something went wrong")
        }
    }
)