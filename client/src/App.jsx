import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'


const PrivateRoute = ({ children }) => {
  const {userInfo} = useAppStore()
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoute = ({ children }) => {
  const {userInfo} = useAppStore()
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children
}

const App = () => {

  const { userInfo, setUserInfo } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const getUserData = async () => {
      try {
        const res = await apiClient.get(
          GET_USER_INFO, 
          { withCredentials: true }
        )


        if (res.status === 200 && res.data._id) {
          setUserInfo(res.data)
        } else {
          setUserInfo(undefined)
        }

        console.log({"getUserData log ": res})
      } catch (error) {
        console.log({"Error in the getUserData in App.jsx ": error})
        setUserInfo(undefined)
      } finally {
        setLoading(false)
      }
 

    }

    if(!userInfo){
      getUserData()
    } else {
      setLoading(false)
    }

  }, [userInfo, setUserInfo])

  if(loading){
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader">
          Loading...
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute>  <Auth />  </AuthRoute>} />

        <Route path="/chat" element={<PrivateRoute>   <Chat />  </PrivateRoute>} />

        <Route path="/profile" element={<PrivateRoute>    <Profile />   </PrivateRoute>} />

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App