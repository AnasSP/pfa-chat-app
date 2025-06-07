import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../../../../../components/ui/input'
import { GrAttachment } from 'react-icons/gr'
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'
import { useAppStore } from '../../../../../store'
import { useSocket } from '../../../../../context/SocketContext'
import { apiClient } from '../../../../../lib/api-client'
import { UPLOADR_FILE_ROUTE } from '../../../../../utils/constants'
import { toast } from 'sonner'

const MessageBar = () => {

    const emojiRef = useRef()
    const fileInputRef = useRef()

    const {selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = useAppStore()
    const socket = useSocket()

    const [message, setMessage] = useState("")
    const [showEmoji, setShowEmoji] = useState(false)

    useEffect(()=>{
        function handleClickOutside(event){
            if(emojiRef.current && !emojiRef.current.contains(event.target) ){
                setShowEmoji(false)
            }
        }
        document.addEventListener("mousedown",handleClickOutside)
        return () => {
            document.removeEventListener("mousedown",handleClickOutside)
        }
    },[emojiRef])

    const handleAddEmoji = (emoji) => {
        setMessage((msg)=>msg + emoji.emoji)
        setShowEmoji(false)
    }

    const handleSendMessage = async () => {
        if(selectedChatType === "contact"){
            socket.emit("sendMessage",{
                sender: userInfo._id,
                content: message,
                receiver: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined
            })
        } else  if(selectedChatType === "channel"){
            socket.emit("sendChannelMessage",{
                sender: userInfo._id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id
            })
        }
        setMessage("")
    }

    const handleAttachmentClick = () => {
        if(fileInputRef.current){
            fileInputRef.current.click()
        }
    }

    const handleAttachmentChange = async (e) =>{
        try {
            const file = e.target.files[0]

            if(file){
                const formData = new FormData()
                formData.append("file",file)

                setIsUploading(true)

                const res = await apiClient.post(UPLOADR_FILE_ROUTE, formData, 
                    {
                        withCredentials: true,
                        onUploadProgress: data =>{
                            setFileUploadProgress(Math.round((data.loaded *100)/data.total))
                        }
                    },
                )

                if(res.status === 200 && res.data){
                    setIsUploading(false)
                    if(selectedChatType === "contact"){
                        socket.emit("sendMessage",{
                            sender: userInfo._id,
                            content: undefined,
                            receiver: selectedChatData._id,
                            messageType: "file",
                            fileUrl: res.data.filePath
                        })
                    }
                
                }else if(selectedChatType === "channel"){
                    socket.emit("sendChannelMessage",{
                        sender: userInfo._id,
                        content: undefined,
                        messageType: "file",
                        fileUrl: res.data.filePath,
                        channelId: selectedChatData._id
                    })
                }
            }
            console.log({file})
            toast.success("File uploaded successfully")
        } catch (error) {
            setIsUploading(false)
            console.log("handleAttachmentChange ~ error:", error)
            toast.error("Error while uploading the file")
            
        }
    }

  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 '>
        <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5  ">

            <input 
                type='text' 
                className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none' 
                placeholder='Enter message' 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <button 
                className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer ' 
                onClick={handleAttachmentClick}
            >
                <GrAttachment className='text-2xl' />
            </button>

            <input type="file" className='hidden' ref={fileInputRef} onChange={handleAttachmentChange} />

            <div className="realative  ">

                <button 
                    className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer ' 
                    onClick={()=>setShowEmoji(true)}    
                >
                    <RiEmojiStickerLine className='text-2xl' />
                </button>

                <div 
                    className="absolute bottom-16 right-0"
                    ref={emojiRef}
                >

                    <EmojiPicker 
                        theme='dark'  
                        open={showEmoji} 
                        onEmojiClick={handleAddEmoji} 
                        autoFocusSearch={false} 
                    />
                </div>

            </div>

        </div>

        <button 
            className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer ' 
            onClick={handleSendMessage}
        >
            <IoSend className='text-2xl' />
        </button>

    </div>

  )
}

export default MessageBar