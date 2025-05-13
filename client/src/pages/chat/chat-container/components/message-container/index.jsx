import React, { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../../../../store'
import moment from 'moment/moment'
import { apiClient } from '../../../../../lib/api-client'
import { GET_ALL_MESSAGES, GET_CHANNEL_MESSAGES, HOST } from '../../../../../utils/constants'
import { MdFolderZip} from 'react-icons/md'
import { IoMdArrowDown } from "react-icons/io";
import { IoCloseSharp } from 'react-icons/io5'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../components/ui/avatar'
import { getColor } from '../../../../../lib/utils'

const MessageContainer = () => {

    const scrollRef = useRef()
    
    const {selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessages,  setIsDownloading,  setFileDownloadProgress, userInfo } = useAppStore()

    const [showImage, setShowImage] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)


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


        const getChannelMessages = async () => {
            try {
                const res = await apiClient.get(`${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`, {withCredentials : true})

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
            } else if(selectedChatType ==="channel"){
                getChannelMessages()
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


    const checkIfImage = (filePath) => {
        const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filePath);
    };


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
                        selectedChatType === "contact" && renderNewMessages(message)
                    }
                    {
                        selectedChatType === "channel" && renderChannelMessages(message)
                    }
                </div>
            )
        })
    }


    const downloadFile = async (fileUrl) => {
        setIsDownloading(true)
        setFileDownloadProgress(0)

        const res = await apiClient.get( `${HOST}/${fileUrl}` , 
            {
                responseType: "blob",
                onDownloadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent
                    const percentCompleted = Math.round((loaded * 100) / total)
                    setFileDownloadProgress(percentCompleted)
                }
            }
        )
        const fileUrlBlob = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = fileUrlBlob
        link.setAttribute("download", fileUrl.split("/").pop())
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(fileUrlBlob)
        setIsDownloading(false)
        setFileDownloadProgress(0)

        toast.success("File downloaded successfully")
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

            {
                message.messageType === "file" && (
                    <div className={`${message.sender !== selectedChatData._id  ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" 
                        :  "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20" }
                        border inline-block p-4 rounded my-1 max-w-[50%] `} 
                    >
                        {
                            checkIfImage(message.fileUrl) 
                                ? <div className=' cursor-pointer '
                                    onClick={() => {
                                        setShowImage(true)
                                        setImageUrl(message.fileUrl)}
                                    }
                                >
                                        <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
                                    </div> 

                                : <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4'>
                                    <span className=' text-white/80 text-3xl bg-black/20 rounded-full p-3 max-w-[10vw]' >
                                        <MdFolderZip/>
                                    </span>

                                    <span className='truncate max-w-[80vw] sm:max-w-[250px]'>
                                        {message.fileUrl.split("/").pop()}
                                    </span>

                                    <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 max-w-[9vw]'
                                        onClick={()=> downloadFile(message.fileUrl)} 
                                    >
                                        <IoMdArrowDown/>
                                    </span>
                                </div>
                        }
                    </div>
                )
            }

            <div className='text-xs text-gray-600 ' >
                {moment(message.timeStamp).format("LT")}
            </div>

        </div>

    const renderChannelMessages = (channelMessage) => {
        if (!channelMessage?.sender) return null;
        
        return (
            <div className={`mt-5 ${channelMessage.sender._id === userInfo._id ? "text-right" : "text-left"}`}>
                {/* Text messages */}
                {channelMessage.messageType === "text" && (
                    <div className={`${channelMessage.sender._id === userInfo._id 
                        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" 
                        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"}
                        border inline-block p-4 rounded my-1 max-w-[50%] ${channelMessage.sender._id !== userInfo._id ? 'ml-9' : ''}`}
                    >
                        {channelMessage.content}
                    </div>
                )}
                

                {/* File messages */}
                {channelMessage.messageType === "file" && (
                    <div className={`${channelMessage.sender._id === userInfo._id 
                        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" 
                        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"}
                        border inline-block p-4 rounded my-1 max-w-[50%] ${channelMessage.sender._id !== userInfo._id ? 'ml-9' : ''}`}
                    >
                        {checkIfImage(channelMessage.fileUrl) ? (
                            <div className="cursor-pointer"
                                onClick={() => {
                                    setShowImage(true);
                                    setImageUrl(channelMessage.fileUrl);
                                }}
                            >
                                <img 
                                    src={`${HOST}/${channelMessage.fileUrl}`} 
                                    height={300} 
                                    width={300}
                                    className="object-cover rounded"
                                    alt="shared" 
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                                    <MdFolderZip/>
                                </span>
                                <span className="flex-1 truncate">
                                    {channelMessage.fileUrl.split("/").pop()}
                                </span>
                                <span 
                                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                    onClick={() => downloadFile(channelMessage.fileUrl)}
                                >
                                    <IoMdArrowDown/>
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Sender info and timestamp */}
                {channelMessage.sender._id !== userInfo._id && (
                    <div className="flex items-center gap-3 mt-1">
                        <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                            {channelMessage.sender.image ? (
                                <AvatarImage 
                                    src={`${HOST}/${channelMessage.sender.image}`} 
                                    alt="profilePic" 
                                    className="object-cover w-full h-full bg-black"
                                />
                            ) : (
                                <AvatarFallback className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(channelMessage.sender.color || 0)}`}>
                                    {channelMessage.sender.firstName?.charAt(0) || 
                                     channelMessage.sender.email?.charAt(0) || '?'}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <span className="text-sm text-white/60">
                            {channelMessage.sender.firstName || channelMessage.sender.email}
                        </span>
                        <span className="text-sm text-white/60">
                            {moment(channelMessage.timeStamp).format("LT")}
                        </span>
                    </div>
                )}
                {
                    channelMessage.sender._id === userInfo._id && (
                        <div className="text-sm text-white/60 mt-1">
                            {moment(channelMessage.timeStamp).format("LT")}
                        </div>
                    )
                }
            </div>
        );
    };

  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] sm:w-full ' >
        {renderMessages()}
        <div ref={scrollRef}/>
        {
            showImage && (
                <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col ">
                    <div>
                        <img src={`${HOST}/${imageUrl}`}  className="h-[80vh] w-full bg-cover " />
                    </div>
                    <div className="flex gap-5 fixed top-0 mt-5 ">
                        
                        <button className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300' 
                            onClick={() => downloadFile(imageUrl)}
                        >
                            <IoMdArrowDown/>
                        </button>

                        <button className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300' 
                            onClick={() => {
                                setShowImage(false)
                                setImageUrl(null)
                            }}
                        >
                            <IoCloseSharp/>
                        </button>

                    </div>
                </div>
            )
        }
    </div>
  )
}

export default MessageContainer