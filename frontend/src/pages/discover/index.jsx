 import React, { useEffect } from 'react'
import UserLayout from '@/layouts/UserLayout'
import Dashboardlayout from '@/layouts/dashboardLayout'
import { useDispatch, useSelector} from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import { base_URL } from '@/config';
import styles from "./index.module.css"
import { useRouter } from 'next/router'


export default function discoverpage() {
  const authState = useSelector((state)=> state.auth)
  const router = useRouter()

  const dispatch = useDispatch();
  useEffect(()=>{
    if(!authState.all_profiles_fetched){
      dispatch(getAllUsers())
    }
  })
  



  return (
    <UserLayout>
      <Dashboardlayout>
   <div className={styles.allUserProfile}>

    {
      authState.all_profiles_fetched && authState.all_users.map((user)=>{
        return(
          <div onClick={()=>{
            router.push(`/view_profile/${user.userId.username}`)
          }} key={user._id} className={styles.userCard}>
                  <img  className={styles.userCard_image} src= {`${base_URL}/${user.userId.profilePicture}`} alt=''></img>
                  <div>
                  <h1>{user.userId.name}</h1>
                  <p>{user.userId.username}</p>
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
