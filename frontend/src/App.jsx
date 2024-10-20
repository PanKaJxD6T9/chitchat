import React, { Children, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chats'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;

  // Ensure that the component does not cause a re-render loop
  if (!isAuthenticated) {
    return <Navigate to='/auth'/>;
  }
  
  return children;
}

const AuthRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;

  // Ensure that the component does not cause a re-render loop
  if (isAuthenticated) {
    // Check if the user's profile is set up
    if (!userInfo.profileSetup) {
      return <Navigate to='/profile'/>; // Redirect to /profile if not set up
    }
    return <Navigate to='/chats'/>; // Redirect to /chat if set up
  }
  
  return children;
}

const App = () => {

  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    const getUserData = async()=>{
      try{
        const response = await apiClient.get(GET_USER_INFO, {withCredentials: true});
        if(response.status === 200 && response.data.id){
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
        console.log(response)
      } catch(err){
        setUserInfo(undefined)
      } finally {
        setLoading(false)
      }
    }

    if(!userInfo){
      getUserData();
    } else {
      setLoading(false)
    }

  }, [userInfo, setUserInfo])

  if(loading){
    return(
      <div>
        Loading...
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>}/>
        <Route path='/chats' element={<PrivateRoute><Chat /></PrivateRoute>}/>
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>}/>
        <Route path='*' element={<Navigate to='/auth'/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
