import React, { useEffect } from 'react';
import "./styles.css";
import { auth } from '../../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import userImg from "../../assets/user.svg";

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logged Out Successfully!");
          navigate("/");
        }).catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">VittApp.</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img 
            src={user.photoURL ? user.photoURL : userImg} 
            alt="User Profile"
            style={{ height: "2rem", width: "2rem", borderRadius: "50%" }} 
            onError={(e) => { e.target.src = userImg; }} // Fallback if photoURL fails to load
          />
          <p className="logo link" onClick={logoutFnc}>Logout</p>
        </div>
      )}
    </div>
  );
}

export default Header;
