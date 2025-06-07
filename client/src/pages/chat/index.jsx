<<<<<<< HEAD
import React, { useEffect } from 'react'
import { useAppStore } from '../../store'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './contacts-container';
import ChatContainer from './chat-container';
import Emptychatcontainer from './empty-chat-container';

const Chat = () => {

  const { userInfo, selectedChatType, isUploading, isDownloading, fileUploadProgress, fileDownloadProgress} = useAppStore();

  const navigate = useNavigate()

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.info("Please complete your profile setup to continue")
      navigate("/profile");
    }
  },[userInfo, navigate])

  return (
      <div className='flex h-[100vh] text-white overflow-hidden  '>
            {
              isUploading && (
                <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg '>
                  <h5 className=' text-4xl animate-pulse  ' >Uploading File</h5>
                  {fileUploadProgress}%
                </div>
              )
            }
            {
              isDownloading && (
                <div className='h-[100vh] w-[100vw] fixed top-0 z-10 left-0 bg-black/80 flex items-center justify-center flex-col gap-5 backdrop-blur-lg '>
                  <h5 className=' text-4xl animate-pulse  ' >Downloading File</h5>
                  {fileDownloadProgress}%
                </div>
              )
            }
      <ContactsContainer/>
      {
        selectedChatType === undefined ? (<Emptychatcontainer/>) : (<ChatContainer/>)
      }
      
    </div>
=======
import React from 'react'

const Chat = () => {
  return (
    <div>Chat</div>
>>>>>>> d8b3514 (1st: --> 1:16:31)
  )
}

export default Chat