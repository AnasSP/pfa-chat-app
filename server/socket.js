import { Server as SocketIoServer } from "socket.io"
import Message from "./models/MessagesModel.js"
import Channel from "./models/ChannelModel.js"

const setUpSocket = (server) => {
    const io = new SocketIoServer(server,{
        cors:{
            origin : process.env.ORIGIN,
            methods : ["GET", "POST"],
            credentials : true
        }
    })

    const userSocketMap = new Map()

    const disconnect = (socket)=>{
        console.log(`User disconnected ${socket.id} `)
        for (const [userId, socketId] of userSocketMap.entries() ){
            if(socketId === socket.id){
                userSocketMap.delete(userId)
                break
            }
        }
    }

    const sendMessage = async (message) =>{
        const senderSocketId = userSocketMap.get(message.sender) 
        const receiverSocketId = userSocketMap.get(message.receiver)

        const createdMessage = await Message.create(message)

        const messageData = await Message.findById(createdMessage._id)
                                        .populate("sender","_id email firstName lastName image color")
                                        .populate("receiver","_id email firstName lastName image color")
        
        if(receiverSocketId){
            io.to(receiverSocketId).emit("receiveMessage",messageData)
        }

        if(senderSocketId){
            io.to(senderSocketId).emit("receiveMessage",messageData)
        }

    }

    const sendChannelMessage = async (message) => {
        const {channelId, sender, content, messageType, fileUrl} = message

        const createdMessage = await Message.create({
            sender,
            receiver: null,
            content,
            messageType,
            timeStamp: new Date(),
            fileUrl,
        })

        const messageData = await Message.findById(createdMessage._id)
                                        .populate("sender", "_id email firstName lastName image color")
                                        .exec()

        await Channel.findByIdAndUpdate(
            channelId,{
                $push: {
                    channelMessages: createdMessage._id
                }
            }
        )

        const channel = await Channel.findById(channelId)
                                    .populate("channelMembers")     
                                    
        const channelMembersData = {...messageData._doc, channelId: channel._id}

        if(channel && channel.channelMembers){
            channel.channelMembers.forEach((channelMember) => {
                const memberSocketId = userSocketMap.get(channelMember._id.toString())
                if(memberSocketId){
                    io.to(memberSocketId).emit("receiveChannelMessage", channelMembersData)
                }
            })
            const adminSocketId = userSocketMap.get(channel.channelAdmin._id.toString())
            if(adminSocketId){
                io.to(adminSocketId).emit("receiveChannelMessage", channelMembersData)
            }
        }

    }

    io.on("connection", (socket)=>{
        const userId = socket.handshake.query.userId

        if(userId){
            userSocketMap.set(userId, socket.id)
            console.log(`User ${userId} connected with SocketId: ${socket.id} `)
        } else {
            console.log(`User id not provided `)
        }

        socket.on("sendMessage",sendMessage)
        socket.on("sendChannelMessage",sendChannelMessage)
        socket.on("disconnect",()=> disconnect(socket) )

        
    })


}

export default setUpSocket
