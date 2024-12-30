import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import bcrypt from 'bcrypt';
import Comment from "../models/comments.model.js";





export const activeCheck = async(req,res)=>{
    return res.status(200).json({message : "running"})
}



export const createPost = async(req,res)=>{
    const {token} = req.body;
    console.log(req.file);

    try{
        const user = await User.findOne({token:token})
        if (!user) {return res.status(404).json({message:"user not found"})
        }

        const post = new Post({
            userId:user._id, 
            body: req.body.body,
            media: req.file!= undefined ? req.file.filename : "",
            filType: req.file != undefined? req.file.mimetype.split("/")[1]:""
        })
        await post.save();
        return res.status(200).json({messages:"post created"})

    }
    catch(error){
        return  res.status(500).json({message: error.message})
    }

}








export const getAllPosts =async (req,res)=>{
    try{
        const posts = await Post.find().populate("userId", 'name username email profilePicture')
        return res.json({posts})
    }
catch(error){
    return  res.status(500).json({message: error.message})
}
}


export const deletePost = async(req,res) =>{
    const {token, post_id} = req.body
    try{ 
        
     const user = await User.findOne({token:token})
                     .select("_id");
   if (!user) {return res.status(404).json({message:"user not found"})
        }

  const post = await Post.findOne({_id:post_id});
  
  if(!post){
    return res.status(404).json({message:"post is not found"})
  }

  if(post.userId.toString()!== user._id.toString()){
    return res.status(404).json({messages:"unauthorized access"})
  }
  await Post.deleteOne({_id: post_id})
  return res.json({messages:"post deleted"})
                           
      
    }
    catch{
        return  res.status(500).json({message: error.message})
    }
}



/*export const commentPost = async(req,res)=>{
   const {token, post_id,commentBody} = req.body;
 
 
   try{
    const user = User.findOne({token:token}).select("_id")
    if (!user) {return res.status(404).json({message:"user not found"})
    }

    const post = await Post.findOne({
        _id:post_id
    });
    if (!post) {return res.status(404).json({message:"post not found"})
    }

    const comment = new Comment({
        userId: user._id,
        postId : post_id,
        body : commentBody
    })
    await comment.save()
    return res.status(200).json({messages:"comment added"})


   }
   catch(error){
    return  res.status(500).json({message: error.message})
   }
   
}*/

export const commentPost = async (req, res) => {
    const { token, post_id, commentBody } = req.body;

    try {
        // Await the user lookup to ensure we get the user document
        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Check if the post exists
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Validate comment body
        if (!commentBody || commentBody.trim() === "") {
            return res.status(400).json({ message: "Comment body cannot be empty" });
        }

        // Create the comment object
        const comment = new Comment({
            userId: user._id,
            postId: post_id,
            body: commentBody
        });

        // Save the comment to the database
        await comment.save();
        return res.status(200).json({ message: "Comment added" });

    } catch (error) {
        console.error("Error in commentPost function:", error); // Log the error for debugging
        return res.status(500).json({ message: error.message });
    }
}; 



export const get_comments_by_post = async(req,res)=>{
    const {post_id} = req.query;
    console.log(post_id)

    try{

        const post = await Post.findOne({
            _id:post_id
        })

        if(!post){
            return res.status(404).json({message:"post not found"})
        }
        const comments = await Comment.find({postId:post_id}).populate("userId", 'username name');
     

        return res.json(comments.reverse())
    }
    catch(error){
        return  res.status(500).json({message: error.message})
    }

} 


export const delete_comment_of_user = async(req,res)=>{
    const {token,comment_id} = req.body;
    try{

        const user =await  User.findOne({token:token}).select("_id")
        if (!user) {return res.status(404).json({message:"user not found"})
        }

        const comment =  await Comment.findOne({
            "_id":comment_id

        })
        if (!comment) {return res.status(404).json({message:"comment not found"})
        }

        if(comment.userId.toString()!== user._id.toString()){
            return res.status(404).json({messages:"unauthorized access"})
          }
     await Comment.deleteOne({"_id":comment_id})
     return res.json({message:"comment deleted"})
    }
    catch(error){
        return  res.status(500).json({message: error.message})
    }
}



export const increment_likes = async(req,res)=>{
    const {post_id} = req.body

    try{

   const post = await Post.findOne({
    _id:post_id
   })


   if (!post) {return res.status(404).json({message:"post not found"})}


post.likes = post.likes+1;
await post.save();
return res.json({message: "likes incremented"})

    
}

    catch(error){
        return  res.status(500).json({message: error.message})
    }
    
}
