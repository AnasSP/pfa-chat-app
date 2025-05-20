import { createContext, useContext, useEffect, useRef } from "react";
import { useAppStore } from "../store";
import { io } from "socket.io-client";
import { HOST } from "../utils/constants";
import { toast } from "sonner";


const SocketContext = createContext(null)



export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketProvider = ({children}) => {
    const socket = useRef()
    const {userInfo} = useAppStore()

    useEffect(() => {
        if(userInfo){
            socket.current = io(HOST,{
                withCredentials: true,
                query:{userId:userInfo._id},
            })
            socket.current.on("connect", ()=> {
                console.log("Connected to socket server")
            })

            const handlReceiveMessage = (message) => {
                const {selectedChatData, selectedChatType, addMessage, addContactInContactList, incrementUnreadCount  } = useAppStore.getState()

                // if (message.sender._id !== userInfo._id && 
                //     (!selectedChatData || message.sender._id !== selectedChatData._id)) {
                    
                //     const content = message.messageType === "text" 
                //         ? message.content 
                //         : "Sent an attachment";
                    
                //     toast.message("New Message", {
                //         description: `${message.sender.firstName || message.sender.email}: ${content}`,
                //         duration: 4000
                //     });
                // }

 if (message.sender._id !== userInfo._id) {
        // Increment unread count if chat is not currently selected
        if (!selectedChatData || selectedChatData._id !== message.sender._id) {
            incrementUnreadCount(message.sender._id, 'contacts')
            
            const content = message.messageType === "text" 
                ? message.content 
                : "Sent an attachment";
            
            toast.message("New Message", {
                description: `${message.sender.firstName || message.sender.email}: ${content}`,
                duration: 4000
            });
        }
    }

                if(selectedChatType !== undefined && 
                    (selectedChatData._id === message.sender._id || selectedChatData._id === message.receiver._id )){

                        
                    console.log("🚀 ~ handlReceiveMessage ~ message:", message)
                    addMessage(message)
                }
                addContactInContactList(message)
                // Show notification only if message is from someone else and chat is not currently selected
                
            }

            
            const handleReceiveChannelMessage = (channelMessage) => {
                const {selectedChatData, selectedChatType, addMessage, addChannelInChannelList, incrementUnreadCount, channels } = useAppStore.getState()

                // console.log("-----Received channel message:", channelMessage)
                // console.log("-------Current selected chat:", selectedChatData)

                // if (channelMessage.sender._id !== userInfo._id && 
                //     (!selectedChatData || selectedChatData._id !== channelMessage.channelId)) {
                    
                //     const content = channelMessage.messageType === "text" 
                //         ? channelMessage.content 
                //         : "Sent an attachment";
                    
                //     toast.message("New Channel Message", {
                //         description: `${channelMessage.sender.firstName || channelMessage.sender.email} in ${channelMessage.channelName}: ${content}`,
                //         duration: 4000
                //     });
                // }

if (channelMessage.sender._id !== userInfo._id) {
        if (!selectedChatData || selectedChatData._id !== channelMessage.channelId) {
            incrementUnreadCount(channelMessage.channelId, 'channels')
            
            const content = channelMessage.messageType === "text" 
                ? channelMessage.content 
                : "Sent an attachment";
            
            // Find channel name from channels list
            const channel = channels.find(ch => ch._id === channelMessage.channelId)
            const channelName = channel ? channel.channelName : 'Unknown Channel'
            
            toast.message("New Channel Message", {
                description: `${channelMessage.sender.firstName || channelMessage.sender.email} in ${channelName}: ${content}`,
                duration: 4000
            });
        }
    }
            
                if(selectedChatType !== undefined && selectedChatData._id === channelMessage.channelId ){ 
                    console.log("🚀 ~ handleReceiveChannelMessage ~ message:", channelMessage)
                    addMessage(channelMessage)
                }
                addChannelInChannelList(channelMessage)
            }

            socket.current.on("receiveMessage",handlReceiveMessage)
            socket.current.on("receiveChannelMessage", handleReceiveChannelMessage)

            return () => {
                socket.current.disconnect()
            }
        }

    },[userInfo])

    return (
        <SocketContext.Provider value={socket.current} >
            {children}
        </SocketContext.Provider>
    )

}