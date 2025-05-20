export const createChatSlice = (set,get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],

    directMessagesContacts: [],

    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,

    channels: [],

    setChannels: (channels) => set({ channels }),
    addChannel: (channel) => {
        const channels = get().channels
        set({ channels: [channel, ...channels]})
    },
    

    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),

    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),

    setDirectMessagesContacts: (directMessagesContacts) => set({ directMessagesContacts }),
    
    closeChat: () => set({ 
        selectedChatData:undefined, 
        selectedChatType: undefined, 
        selectedChatMessages: [],
    }),

    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages
        const selectedChatType = get().selectedChatType

        // set({ 
        //     selectedChatMessages: [
        //         ...selectedChatMessages, 
        //         selectedChatType === "channel" 
        //             ? {
        //                 ...message,
        //                 sender: message.sender, // Keep the full sender object for channels
        //                 receiver: null
        //             }
        //             : {
        //                 ...message,
        //                 receiver: message.receiver?._id || message.receiver,
        //                 sender: message.sender?._id || message.sender,
        //             }
        //     ] 
        // })

        set({ selectedChatMessages: [
            ...selectedChatMessages, {
                ...message,
                receiver : selectedChatType === "channel" ? message.receiver : message.receiver._id,
                sender : selectedChatType === "channel" ? message.sender : message.sender._id,
            }
        ] })
    },
    addChannelInChannelList: (message) =>{
        const channels = get().channels
        const data = channels.find(channel => channel._id === message.channelId)
        const index = channels.findIndex((channel) => channel._id === message.channelId)
        // console.log("🚀 ~ channels:", channels)
        // console.log("🚀 ~ data:", data)
        // console.log("🚀 ~ index:", index)
        if(index !== -1 && index !== undefined){
            channels.splice(index, 1)
            channels.unshift(data)
        }
    },

    addContactInContactList: (message) => {
        const userId = get().userInfo._id
        const fromId = message.sender._id === userId ? message.receiver._id : message.sender._id
        const fromData = message.sender._id === userId ? message.receiver : message.sender
        const contactsList = get().directMessagesContacts
        const data = contactsList.find((contact) => contact._id === fromId)
        const index = contactsList.findIndex((contact) => contact._id === fromId)
        if(index !== -1 && index !== undefined){
            contactsList.splice(index, 1)
            contactsList.unshift(data)
        } else {
            console.log("error in addContactInContactList: ", message)
            contactsList.unshift(fromData)
        }
        set({ directMessagesContacts: contactsList })

    },

     unreadMessages: JSON.parse(localStorage.getItem('unreadMessages')) || {
        contacts: {},
        channels: {}
    },

    incrementUnreadCount: (id, type) => set((state) => {
        const newUnreadMessages = {
            ...state.unreadMessages,
            [type]: {
                ...state.unreadMessages[type],
                [id]: (state.unreadMessages[type]?.[id] || 0) + 1
            }
        }
        localStorage.setItem('unreadMessages', JSON.stringify(newUnreadMessages))
        return { unreadMessages: newUnreadMessages }
    }),

    clearUnreadCount: (id, type) => set((state) => {
        const newUnreadMessages = {
            ...state.unreadMessages,
            [type]: {
                ...state.unreadMessages[type],
                [id]: 0
            }
        }
        localStorage.setItem('unreadMessages', JSON.stringify(newUnreadMessages))
        return { unreadMessages: newUnreadMessages }
    })
})