import React from 'react'
import { Button } from '../../../../../components/ui/button'
import { RiCloseFill } from 'react-icons/ri'
import { useAppStore } from '../../../../../store'
import { Avatar, AvatarImage } from '../../../../../components/ui/avatar'
import { HOST } from '../../../../../utils/constants'
import { getColor } from '../../../../../lib/utils'
 
const ChatHeader = () => {
    const {closeChat, selectedChatData, selectedChatType } = useAppStore()

    // Early return for no selected chat
    if (!selectedChatData || !selectedChatType) {
        return null;
    }

    const renderAvatar = () => {
        if (selectedChatType === "contact") {
            return (
                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                    {selectedChatData?.image ? (
                        <AvatarImage 
                            src={`${HOST}/${selectedChatData.image}`} 
                            alt="profilePic" 
                            className="object-cover w-full h-full bg-black"
                        />
                    ) : (
                        <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData?.color || 0)}`}>
                            {selectedChatData?.firstName?.charAt(0) || selectedChatData?.email?.charAt(0) || '?'}
                        </div>
                    )}
                </Avatar>
            );
        }
        return <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>#</div>;
    };

    const renderName = () => {
        if (selectedChatType === "channel") {
            return selectedChatData?.channelName;
        }
        return selectedChatData?.firstName 
            ? `${selectedChatData.firstName} ${selectedChatData.lastName || ''}`
            : selectedChatData?.email;
    };

    return (
        <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20'>
            <div className="flex gap-5 items-center w-full justify-between">
                <div className="flex gap-3 items-center justify-center">
                    <div className="w-12 h-12 relative">
                        {renderAvatar()}
                    </div>
                    <div className="text-white">
                        {renderName()}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-5">
                    <button 
                        className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer'
                        onClick={closeChat}
                    >
                        <RiCloseFill className='text-3xl' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;