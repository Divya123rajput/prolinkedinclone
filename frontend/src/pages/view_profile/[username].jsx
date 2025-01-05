import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { base_URL, clientserver } from '@/config';
import Dashboardlayout from '@/layouts/dashboardLayout';
import UserLayout from '@/layouts/UserLayout';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest, getMyConnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction'


export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.post);

  const dispatch = useDispatch();


  const authState = useSelector((state) => state.auth)
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true)

  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionRequest({ token: localStorage.getItem("token") }))
    await dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }))

  }


  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username

    })
    setUserPosts(post);

  }, [postReducer.posts]); // Add dependencies


  useEffect(() => {
    if (authState.connections.some(user => user.connectionId._id === userProfile.userId._id)) {
      setIsCurrentUserInConnection(true)
      if (authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true) {
        setIsConnectionNull(false)
      }
    }
    if (authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id)) {
      setIsCurrentUserInConnection(true)
      if (authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted === true) {
        setIsConnectionNull(false)
      }
    }
  }, [authState.connections, authState.connectionRequest])
  useEffect(() => {
    getUsersPost()
  }, [])

  const searchParamers = useSearchParams();
  useEffect(() => {
    console.log("view profile:view profile")
  })
  return (
    <UserLayout>
      <Dashboardlayout>
        <div className={styles.container}>
          <div className={styles.backdropContainer}>
            <img className={styles.backdrop} src={`${base_URL}/${userProfile.userId.profilePicture}`} alt='backdrop' />
          </div>
          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_flex}>
              <div style={{ flex: "0.8" }}>
                <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem" }}>
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>

                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>

                  {
                    isCurrentUserInConnection ?
                      <button className={styles.connectedButton}>{isConnectionNull ? "pending" : "connected"}</button>
                      :
                      <button onClick={() => {
                        dispatch(sendConnectionRequest({ token: localStorage.getItem("token"), user_id: userProfile.userId._id }))
                      }} className={styles.connectBtn}>connect</button>

                  }

                  <div onClick={async () => {
                    const response = await clientserver.get(`/user/download_resume?id=${userProfile.userId._id}`);
                    window.open(`${base_URL}/${response.data.message}`, "_blank")
                  }} style={{ cursor: "pointer" }}>
                    <svg style={{ width: "1.2em" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>

              </div>
              <div style={{ flex: "0.2" }}>
                <h2>Recent Activity</h2>
                {userPosts.length > 0 ? (
                  userPosts.map((post) => {
                    return (
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
                    )
                  })
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
                userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workhistoryCard}>
                      <p style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        {work.company} - {work.positions}

                      </p>
                      <p>{work.years}</p>

                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </Dashboardlayout>
    </UserLayout>



  )
}


export async function getServerSideProps(context) {
  console.log("from view")
  console.log(context.query.username)
  const request = await clientserver.get("/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username
      }
    }
  )

  const response = await request.data;
  console.log(response)

  return { props: { userProfile: request.data.profile } }
}
