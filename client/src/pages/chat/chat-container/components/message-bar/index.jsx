import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../../../../../components/ui/input'
import { GrAttachment } from 'react-icons/gr'
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'
import { useAppStore } from '../../../../../store'
import { useSocket } from '../../../../../context/SocketContext'

const MessageBar = () => {

    const emojiRef = useRef()

    const {selectedChatType, selectedChatData, userInfo } = useAppStore()
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
                // onClick={}
            >
                <GrAttachment className='text-2xl' />
            </button>

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