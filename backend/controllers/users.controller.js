 import User from "../models/user.model.js";
import Profile from "../models/profile.model.js"
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import ConnectionRequest from "../models/connections.model.js";



const convertUserDataTOPDF = async(userData)=>{
    const doc = new PDFDocument();

    const outputPath =  crypto.randomBytes(32).toString("hex") +".pdf"
    const stream = fs.createWriteStream("uploads/"+ outputPath)

    doc.pipe(stream);
    doc.image(`uploads/${userData.userId.profilePicture}`,{align:"center", width:100})
    doc.fontSize(14).text(`name:${userData.userId.name}`);
    doc.fontSize(14).text(`Username:${userData.userId.name}`);
    doc.fontSize(14).text(`Email:${userData.userId.email}`);
    doc.fontSize(14).text(`Bio:${userData.bio}`);
    doc.fontSize(14).text(`Current Position :${userData.currentPost}`);

    doc.fontSize(14).text(`Past Work`)
    userData.pastWork.forEach((work,index)=>{
        doc.fontSize(14).text(`Company Name :${work.company}`);
        doc.fontSize(14).text(` Position :${work.positions}`);
        doc.fontSize(14).text(`years :${work.years}`);

    });
    doc.end();
    return outputPath





}

 export const register = async(req,res)=>{
    console.log(req.body)
    try{
        const {name,email,password,username} = req.body;
        if(!name || !email || !password || !username)return res.status(400).json({message:"all fields are required"})
            const user = await User.findOne({
        email
        });
        if(user) return res.status(400).json({message:"user already exist"})

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            username
        })

        await newUser.save();


        const profile = new Profile({
            userId: newUser._id
        })

        await profile.save()
        return res.json({message:"user created"})

    }
    catch(error){
         return  res.status(500).json({message: error.message})
    }
}





export const login = async(req,res)=>{
    console.log(req.body)
    try{
        const {email,password} = req.body;
        if( !email || !password ) return res.status(400).json({message: "all fields are required" })


            const user = await User.findOne({
        email
        });
        if(!user) return res.status(404).json({message:"user does not exist"})

        const  isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({message:"invalid credentials "})
        

        const token = crypto.randomBytes(32).toString("hex");
        await User.updateOne({_id:user._id},{token});
        return res.json({token})   
       
    }
    catch(error){
         return  res.status(500).json({message: error.message})
    }
}



export const updateProfilePicture = async (req, res) => {
    const { token } = req.body;



  
    try {
      const user = await User.findOne({ token: token });
  
      if (!user) {
        return res.status(404).json({ message: "user does not exist" });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      console.log(req.file.filename)
  
      user.profilePicture = req.file.filename;

      
  
    
      await user.save();
      return res.json({ message: "profile picture uploaded successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };



export const updateUserProfile = async(req,res)=>{
    try{
        const {token,  ...newuserData} = req.body;
        


        const user = await User.findOne({token:token})
        if (!user) {return res.status(404).json({message:"user not found"})}
        const {username,email} = newuserData;
        const existingUser = await  User.findOne({$or: [{username},{email}]})

        if(existingUser){
            
            if(existingUser || String(existingUser._id) !== String(user._id)){
                return res.status(400).json({message: "user already exist"})
            }
        }
        Object.assign(user,newuserData)
        await user.save()
        return res.json({message: "user updated"}

        )
        
    }
    catch(error){
        return  res.status(500).json({message: error.message})
    }

}

export const getUserAndProfile = async(req,res)=>{
    try{
        const {token} = req.query;

        console.log(`token:${token}`)
            const user = await User.findOne({token:token})
        if (!user) {return res.status(404).json({message:"user not found"})
        }

        const userProfile = await Profile.findOne({userId: user._id})

        .populate('userId','name email username profilePicture');

        console.log(userProfile)

       

       return  res.json(userProfile)


    }
    catch(error){
        return  res.status(500).json({message: error.message})
    }
}


  


export const updateProfileData = async(req,res)=>{
    try{
        const {token, ...newProfileData} = req.body

        const userProfile = await User.findOne({token:token})
        if (!userProfile) {return res.status(404).json({message:"user not found"})
        }

        const profile_to_update = await Profile.findOne({userId:userProfile._id})
        Object.assign(profile_to_update,newProfileData)

        await profile_to_update.save()
        return res.json({message:"profile updates"})


    }
    catch(error){
        return  res.status(500).json({message: error.message})
    }
}


export const getAllUserProfile = async(req,res)=>{
    try{
        const profiles = await Profile.find().populate('userId', 'name username email profilePicture')
        console.log(profiles)
        return res.json({profiles})
      

    }
    
    catch(error){
        return  res.status(500).json({message: error.message})
    }
}


export const downloadProfile = async(req,res)=>{
    const user_id = req.query.id;
    console.log(user_id)
   // return res.json({"message":"not implimented"});


    const userProfile = await Profile.findOne({userId: user_id})
    .populate("userId", 'name username email profilePicture')

    let outputPath= await convertUserDataTOPDF(userProfile);
    return res.json({"message":outputPath})

    


}




export const sendConnectionRequest = async(req,res)=>{
    const {token, connectionId} = req.body

    try{
        const user = await User.findOne({token:token})
        if (!user) {return res.status(404).json({message:"user not found"})
        }
   const connectionUser = await User.findOne({_id : connectionId});

   if (!connectionUser) {
    return res.status(400).json({ message: "Connection user not found" });
  }
  

   const existingRequest = await ConnectionRequest.findOne(
    {
        userId :user._id,
        connectionId : connectionUser._id
    }
   );
    if(existingRequest){
        return  res.status(404).json({message:"request already sent"})

    }

    const request = new ConnectionRequest({
        
        userId :user._id,
        connectionId : connectionUser._id

    })

    await request.save()
    return res.json({mesaage:"request sent"})

    }
    catch(error){
        return  res.status(500).json({message: error.message})
    }
}



export const getConnectionRequest = async(req,res)=>{

    const {token} = req.query;

    try{
        const user = await User.findOne({token:token})
        if (!user) {return res.status(404).json({message:"user not found"})
        }

        const connections = await ConnectionRequest.find({userId:user._id})
        .populate('connectionId' ,'name username email profilePicture')

        return res.json({connections});
       

    }
    catch(error){
        return  res.status(500).json({message: error.message})
    }

}


export const whatAreMyConnections = async(req,res)=>{
    const {token} = req.query;
  try{
    const user = await User.findOne({token})
    if (!user) {return res.status(404).json({message:"user not found"})
    }

    const connections = await ConnectionRequest.find({connectionId:user._id})
    .populate('userId' ,'name username email profilePicture')

    return res.json(connections);

  }
  catch(error){
    return  res.status(500).json({message: error.message})
  }
}


export const acceptConnectionRequest = async(req,res)=>{
    const {token, requestId, action_type} = req.body;
    console.log(req.body)
    try{
        const user = await User.findOne({token:token})
    if (!user) {return res.status(404).json({message:"user not found"})}

        const connection = await ConnectionRequest.findOne({_id:requestId
    })
    if (!connection){return res.status(404).json({message:"connection not found"})

    }

    if (action_type === "accept") {
        connection.status_accepted = true;
    } else {
        connection.status_accepted = false;
    }

    await connection.save();
    return res.json({message:"request updated"})

    
}
    catch(error){
        return  res.status(500).json({message: error.message})   
    }
}




export  const getUserProfileBasedOnUsername = async(req,res)=>{
    const {username} = req.query

    try{

        const user = await User.findOne({username

        });

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const userProfile = await Profile.findOne({userId:user._id})
        .populate('userId', 'name username email profilePicture');

        return res.json({"profile": userProfile})

    }
    catch(error){
        return  res.status(500).json({message: error.message}) 
    }

}