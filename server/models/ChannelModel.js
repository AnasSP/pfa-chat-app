import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    channelName:{
        type: String,
        required: true
    },

    channelMembers:[
        {
            type: mongoose.Schema.ObjectId, 
            ref: "Users",
            required: true
        },
    ],

    channelAdmin:{
        type: mongoose.Schema.ObjectId, 
        ref: "Users",
        required: true
    },

    channelMessages:[
        {
            type: mongoose.Schema.ObjectId, 
            ref: "Messages",
            required: false
        },
    ],

    channelCreatedAt:{
        type: Date,
        default: Date.now
    },

    channelUpdatedAt:{
        type: Date,
        default: Date.now
    }

})

channelSchema.pre("save", function(next){
    this.channelUpdatedAt = Date.now()
    next()
})

channelSchema.pre("findOneAndUpdate", function(next){
    this.set({ channelUpdatedAt: Date.now()})
    next()
})

const Channel = mongoose.model("Channels", channelSchema)
export default Channel