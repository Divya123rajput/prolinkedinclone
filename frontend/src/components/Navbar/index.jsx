import React from 'react';
import styles from './styles.module.css';
import { useRouter } from "next/router"; 
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

const NavbarComponent = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(reset());
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1 
          style={{ cursor: "pointer" }} 
          onClick={() => router.push("/login")}
        >
          pro connect
        </h1>

        {authState.profileFetched ? (
          <div style={{ display: "flex", gap: "1.2rem" }}>
            <p>Hey! {authState.user.userId.name }</p> 
            <p 
              style={{ fontWeight: "bold", cursor: "pointer" }} 
              onClick={() => router.push('/profile')}
            >
              Profile
            </p>
            <p 
              onClick={handleLogout} 
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              Logout
            </p>
          </div>
        ) : (
          <div 
            onClick={() => router.push("/login")} 
            className={styles.buttonJoin}
          >
            <p>Be a part</p>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavbarComponent;



