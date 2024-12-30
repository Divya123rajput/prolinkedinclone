import UserLayout from '@/layouts/UserLayout'
import React, { useEffect, useState } from 'react'

import Dashboardlayout from '@/layouts/dashboardLayout'
import { getAboutUser } from '@/config/redux/action/authAction'
import styles from "./index.module.css";
import { useDispatch, useSelector } from 'react-redux'
import { base_URL, clientserver } from '@/config'
import { getAllPosts } from '@/config/redux/action/postAction';




export default function ProfilePage() {
    const dispatch = useDispatch()
    const authState = useSelector((state)=> state.auth)

    const postReducer = useSelector((state)=>state.post)


    const [userProfile,setUserProfile]= useState({})


    const [userPosts,setUserPosts] = useState([])


  const [inputData, setInputData] = useState({company:"" , positions:"" , years:""})


    const [isModalOpen, setIsModalOpen] = useState(false)


   const  handleWorkInputChange =(e)=>{
      const {name, value} = e.target;
      setInputData({...inputData, [name]:value});

    }

useEffect(
    ()=>{
        dispatch(getAboutUser({token: localStorage.getItem('token')}));
        dispatch(getAllPosts())
    },[dispatch]
)



    useEffect(()=>{
       

       if(authState.user != undefined){ 
        setUserProfile(authState.user)
        let post = postReducer.posts.filter((post)=>{
            return post.userId.username === authState.user.userId.username
      
          })
          setUserPosts(post);
        }
 

    },[authState.user, postReducer.posts])




    const updateProfilePicture = async (file) => {
      const formData = new FormData();
      formData.append("profilePicture", file); // Ensure this matches the multer setup
      formData.append("token", localStorage.getItem("token"))
      
      const response = await clientserver.post("/update_profile_picture", formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });


      

      dispatch(getAboutUser({token:localStorage.getItem("token")}))
    }
    
    



    const updateProfileData =  async()=>{
  
    clientserver.interceptors.request.use((config) => {
  console.log("Request Payload before sending:", config.data);  // Log the request data
  return config;
});

      const request = await clientserver.post("/user_update",{
        token: localStorage.getItem("token"),
        name:  userProfile.userId.name
      })


      const response = await clientserver.post("/update_profile_data",{
        token:localStorage.getItem("token"),
        bio: userProfile.bio,
        currentPost : userProfile.currentPost,
      pastWork: userProfile.pastWork,
    education: userProfile.education})


    dispatch(getAboutUser({token: localStorage.getItem("token")}))
    }




   



  return (
<UserLayout>
  <Dashboardlayout>
    {authState.user && userProfile.userId &&
  <div className={styles.container}>
    <div className={styles.backdropContainer}>

            <label htmlFor='profilePictureUpload' className={styles.backDrop_overlay}>
              
             <p>Edit</p>
            </label>
            <input onChange={(e)=>{
              updateProfilePicture(e.target.files[0])
            }} hidden type='file' id='profilePictureUpload'></input>
        <img  src={`${base_URL}/${userProfile.userId.profilePicture}`} alt='backdrop'/>
  
 
    </div>
    <div className={styles.profileContainer_details}>
      <div style={{display:"flex" , gap:"0.7rem"}}>
        <div style={{flex:"0.8"}}>
          <div style={{display:"flex" , width:"fit-content", alignItems:"center", gap:"1.2rem"}}>
          <input className= {styles.nameEdit} type='text' value={userProfile.userId.name} onChange={(e)=>{
              setUserProfile({...userProfile, userId:{...userProfile.userId, name:e.target.value}})
            }}></input>

            <p style={{color:"grey"}}>@{userProfile.userId.username}</p>

          </div>

          <div>
         <textarea  value={userProfile.bio}
         onChange={(e)=>{
               setUserProfile({...userProfile, bio:e.target.value})
         }}

         rows = {Math.max(3, Math.ceil(userProfile.bio.length/80))
         }
         style = {{width:"100%"}}
         
         />
          </div>

        </div>
        <div style={{ flex: "0.2" }}>
  <h2>Recent Activity</h2>
  {userPosts.length > 0 ? (
    userPosts.map((post) => {return(
      <div key={post._id} className={styles.postCard}>
        <div className={styles.card}>
          <div className={styles.card_profileContainer}>
            {post.media ? (
              <img src={`${base_URL}/${post.media}`} alt="Post media" />
            ) : (
              <div style={{ width: "3.4rem", height: "3.4rem" }} />
            )}
          </div>
          <p>{post.body}</p>
        </div>
      </div>
    )})
  ) : (
    <p>No recent activity to display.</p>
  )}
</div>
        
  

      </div>
    </div>
    <div className="workHisory">
      <h4>work history</h4>
      <div className={styles.workhistoryContainer}>
        {
          userProfile.pastWork.map((work,index)=>{
            return(
              <div key={index} className={styles.workhistoryCard}>
                <p style={{fontWeight:"bold", display:"flex", alignItems:"center",gap:"0.8rem"}}>
                  {work.company} - {work.positions}

                </p>
                <p>{work.years}</p>

                </div>
            )
          })
        }
        <button className={styles.addWorkBtn} onClick={()=>{
          setIsModalOpen(true)

        }}>add work</button>
      </div>
    </div>

    {userProfile != authState.user && 
    <div onClick={()=>{
      updateProfileData()

    }} className={styles.updateProfilebtn}>
      update profile

      </div>
    }
   </div>
}




{isModalOpen && 
      <div 
      onClick={()=>{
       setIsModalOpen(false)
      }} className={styles.commentsContainer}>
        <div 
        onClick={(e)=>{
            e.stopPropagation()
        }} className={styles.allCommentsContainer}>

<input onChange={handleWorkInputChange}  name="company" className={styles.inputField} type="text" placeholder='Enter company'></input>
<input onChange={handleWorkInputChange}  name="positions" className={styles.inputField} type="text" placeholder='Enter position'></input>
<input onChange={handleWorkInputChange}  name= "years"  className={styles.inputField} type="text" placeholder='years'></input>

<div className={styles.updateProfilebtn} onClick={()=>{
             setUserProfile({...userProfile,pastWork:[...userProfile.pastWork,inputData]})
             setIsModalOpen(false)
}}>Add work</div>

        </div>
        </div>
            }

            

  </Dashboardlayout>

  
</UserLayout>
  )
}
