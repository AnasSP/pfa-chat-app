import { rename } from "fs/promises";
import Message from "../models/MessagesModel.js";
import { mkdirSync} from "fs"

export const getMessages = async (req, res, next) => {
    try {
        const sender1 = req.userId
        const receiver1 = req.body._id

        if(!sender1 || !receiver1){
            return res.status(400).send("Both sender' and receiver' IDs are required")
        }



        const messages = await Message.find({
            $or:[
                { sender:sender1, receiver:receiver1 },
                { sender:receiver1, receiver:sender1 },
            
            ]
        }).sort({timeStamp : 1})

        return res.status(200).json({ messages })

    } catch (error) {
        console.log("Error in getMessages controller:", error)
        return res.status(500).json( "Internal server error getMessagesController: " + error.message);
    }
}

export const uploadFile = async (req, res, next) => {
    try {
        
        if(!req.file){
            return res.status(400).send("File is required")
        }

        const date = Date.now()
        let fileDir = `uploads/files/${date}`
        let fileName = `${fileDir}/${req.file.originalname}`

        mkdirSync(fileDir, { recursive: true})

        rename(req.file.path, fileName)

        return res.status(200).json({ filePath: fileName })

    } catch (error) {
        console.log("Error in uploadFile controller:", error)
        return res.status(500).json( "Internal server error uploadFileController: " + error.message);
    }
}