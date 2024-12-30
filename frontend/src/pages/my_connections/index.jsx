import React, { useEffect,useState } from 'react'
import UserLayout from '@/layouts/UserLayout'
import Dashboardlayout from '@/layouts/dashboardLayout'
import { useDispatch,useSelector} from 'react-redux'
import { AcceptConnection, getMyConnectionRequests } from '@/config/redux/action/authAction';
import { base_URL } from '@/config';
import { useRouter } from 'next/router';
import styles from './index.module.css' 


export default function MyconnectionsPage() {
  const dispatch = useDispatch();
  const authState = useSelector((state)=>state.auth)


  useEffect(()=>{
    dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}))

  },[])

  const router = useRouter()


  useEffect(()=>{
    if(authState.connectionRequest.length != 0){
      console.log(authState.connectionRequest) 
    }

  },[authState.connectionRequest])


  return (
    <UserLayout>
    <Dashboardlayout>
        <div style={{display:"flex" ,flexDirection:"column", gap:"1.2rem" }}>
          <h1>my connections</h1>
        {authState.connectionRequest.length ===0 && <h1>no connection request</h1>}
          {
            authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection)=> connection.status_accepted === null).map((user, index)=>{
              return(
               <div onClick={()=>{
                router.push(`/view_profile/${user.userId.username}`)
               }} className={styles.userCard} key={index}>
                <div style={{display:"flex" , alignItems:"center", gap:"1.2rem", justifyContent:"space-between"}}>
                <div className={styles.profilePicture}>
                 <img src={`${base_URL}/${user.userId.profilePicture}`} alt=''>
                 
                 </img> 
                </div>

                <div className={styles.userInfo}>
                  <h2>{user.userId.name}</h2>
                  <h2>{user.userId.username}</h2>
                </div>
                <button onClick={(e)=>{e.stopPropagation()
                               dispatch(AcceptConnection({
                                connectionId:user._id,
                                token:localStorage.getItem("token"),
                                action:"accept"
                               }))
                  
                  ;}} className={styles.connectedButton}>Accept</button>
                </div>
               </div>
              )
            })
          }

          <h1>My Networks</h1>
      
          {
        authState.connectionRequest.filter((connection)=> connection.status_accepted != null ).map((user, index)=>{
              return(
               <div onClick={()=>{
                router.push(`/view_profile/${user.userId.username}`)
               }} className={styles.userCard} key={index}>
                <div style={{display:"flex" , alignItems:"center", gap:"1.2rem", justifyContent:"space-between"}}>
                <div className={styles.profilePicture}>
                 <img src={`${base_URL}/${user.userId.profilePicture}`} alt=''>
                 
                 </img> 
                </div>

                <div className={styles.userInfo}>
                  <h2>{user.userId.name}</h2>
                  <h2>{user.userId.username}</h2>
                </div>
               
                </div>
               </div>




              )
            })
          }



          
          
          </div>

          
    </Dashboardlayout>
    </UserLayout>
  )
}
