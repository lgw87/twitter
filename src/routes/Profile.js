import { authService } from "../fbase";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";

export default ({refreshUser , userObj}) => {
  const [newDisplayName , setNewDisplayName] = useState(userObj.displayName);
  const navigate = useNavigate();
  const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
  }
  const onChange = (event) => {
    const {
      target:{ value },
    } = event;
    setNewDisplayName(value);

  }
  const onSubmit = async (event) => {
    event.preventDefault();
    if(userObj.displayName !== newDisplayName){
      
      const auth = getAuth();
      await updateProfile(auth.currentUser, {
          displayName: newDisplayName
      })
      refreshUser();
    }
  }
  return (
      <div className="container">
        <form onSubmit={onSubmit}>
          <input 
            type="text" 
            placeholder="Display name" 
            onChange={onChange} 
            value={newDisplayName}
            autoFocus
            className="formInput"
          />
          <input 
            type="submit"
            value="Update Profile"
            className="formBtn"
            style={{
              marginTop: 10,
            }}
          />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  )
}