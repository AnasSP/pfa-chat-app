import React, { useEffect, useRef } from 'react'
import { useAppStore } from '../../../../../store'
import moment from 'moment/moment'
import { apiClient } from '../../../../../lib/api-client'
import { GET_ALL_MESSAGES } from '../../../../../utils/constants'

const MessageContainer = () => {

    const scrollRef = useRef()
    
    const {selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages } = useAppStore()


    useEffect(() => {

        const getMessages = async () => {
            try {
                const res = await apiClient.post(GET_ALL_MESSAGES, {_id : selectedChatData._id}, {withCredentials : true})

                if(res.data.messages){
                    setSelectedChatMessages(res.data.messages)
                }

            } catch (error) {
                console.log("Error in getMessages messages-container:", error)
            }
        }

        if(selectedChatData._id){
            if(selectedChatType === "contact"){
                getMessages()
            }
        }
    },[selectedChatData, selectedChatType, setSelectedChatMessages])


    useEffect(() => {
        if(scrollRef.current){
            scrollRef.current.scrollIntoView({behavior : "smooth"})
        }
    },[selectedChatMessages])



    const renderMessages = () => {
        let lastDate = null
        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.timeStamp).format("DD-MM-YYYY")
            const showDate = messageDate !== lastDate
            lastDate = messageDate

            return(
                <div key={index}>
                    {showDate && (
                        <div className='text-center text-gray-500 my-2 ' >
                            {moment(message.timeStamp).format("LL")}
                        </div>
                        
                    )}
                    {
                        selectedChatType === "contact" &&
                            renderNewMessages(message)
                    }
                </div>
            )
        })
    }

    const renderNewMessages = (message) => 
        <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right" }`} >
            {
                message.messageType === "text" && (
                    <div className={`${message.sender !== selectedChatData._id  ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" 
                        :  "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20" }
                        border inline-block p-4 rounded my-1 max-w-[50%] `} 
                    >
                    {message.content}
                    </div>
                )
            }
            <div className='text-xs text-gray-600 ' >
                {moment(message.timeStamp).format("LT")}
            </div>
        </div>

  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] sm:w-full ' >
        {renderMessages()}
        <div ref={scrollRef}/>
    </div>
  )
}

export default MessageContainer