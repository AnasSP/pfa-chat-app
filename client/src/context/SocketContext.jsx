import { createContext, useContext, useEffect, useRef } from "react";
import { useAppStore } from "../store";
import { io } from "socket.io-client";
import { HOST } from "../utils/constants";


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
                const {selectedChatData, selectedChatType, addMessage, addContactInContactList } = useAppStore.getState()

                if(selectedChatType !== undefined && 
                    (selectedChatData._id === message.sender._id || selectedChatData._id === message.receiver._id )){

                        
                    console.log("🚀 ~ handlReceiveMessage ~ message:", message)
                    addMessage(message)
                }
                addContactInContactList(message)
            }

            
            const handleReceiveChannelMessage = (channelMessage) => {
                const {selectedChatData, selectedChatType, addMessage, addChannelInChannelList } = useAppStore.getState()

                // console.log("-----Received channel message:", channelMessage)
                // console.log("-------Current selected chat:", selectedChatData)
            
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