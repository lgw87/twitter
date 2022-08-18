import React, { useEffect, useState } from 'react';
import AppRouter from './Router';
import {authService} from '../fbase';
import { updateCurrentUser } from 'firebase/auth';

function App() {
  const [init , setInit] = useState(false);
  const [userObj , setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setUserObj(user);
      } else {
        setUserObj("");
      }
      setInit(true);
    });
  } , []);
  const refreshUser = async () => {
    await updateCurrentUser(authService , authService.currentUser);
    setUserObj(authService.currentUser);
  }
  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser}isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..." }
    </>  
  )


}

export default App;
