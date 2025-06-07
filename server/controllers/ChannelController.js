import mongoose from "mongoose"
import User from "../models/UserModel.js"
import Channel from "../models/ChannelModel.js"
import path from "path"

export const createChannel = async (req, res, next) => {
    try {
        const { channelName, channelMembers } = req.body
        const userId = req.userId

        const channelAdmin = await User.findById(userId)

        if (!channelAdmin){
            return res.status(400).json("Channel admin not found")
        }
        
        const validMembers = await User.find(
            { _id: { $in: channelMembers }}
        )

        if (validMembers.length !== channelMembers.length){
            return res.status(400).json("Invalid channel members")
        }

        const newChannel = new Channel({
            channelName,
            channelMembers,
            channelAdmin : userId
        })

        await newChannel.save()

        return res.status(201).json({
            message: "Channel created successfully",
            channel: newChannel
        });

    } catch (error) {
        console.log("Error in createChannel controller:", error)
        return res.status(500).json( "Internal server error createChannelController: " + error.message);
    }
}

export const getUserChannels = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId)

        const channels = await Channel.find({
            $or: [
                { channelAdmin: userId },
                { channelMembers: userId}
            ]
        }).sort({ channelUpdatedAt: -1 })
        

        return res.status(200).json({
            // message: "Channel created successfully",
            channels
        });

    } catch (error) {
        console.log("Error in getUserChannels controller:", error)
        return res.status(500).json( "Internal server error getUserChannelsController: " + error.message);
    }
}

export const getChannelMessages = async (req, res, next) => {
    try {
        const {channelId} = req.params
        const channel = await Channel.findById(channelId)
                                    .populate({
                                                path: "channelMessages" , 
                                                populate: {path: "sender",
                                                    select : "firstName lastName email _id image color"
                                                } 
                                            })
        if(!channel){
            return res.status(404).send("Channel not found")
        }

        const messages = channel.channelMessages

        return res.status(200).json({
            // message: "Channel created successfully",
            messages
        });

    } catch (error) {
        console.log("Error in getUserChannels controller:", error)
        return res.status(500).json( "Internal server error getUserChannelsController: " + error.message);
    }
}

