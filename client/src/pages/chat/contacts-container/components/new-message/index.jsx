import React, { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../../components/ui/tooltip'
import { FaPlus } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { Input } from '../../../../../components/ui/input'
import { animationDefaultOptions, getColor } from '../../../../../lib/utils'
import Lottie from 'react-lottie'
import { apiClient } from '../../../../../lib/api-client'
import { HOST, SEARCH_CONTACTS_ROUTES } from '../../../../../utils/constants'
import { ScrollArea } from '../../../../../components/ui/scroll-area'
import {Avatar, AvatarImage} from '../../../../../components/ui/avatar'
import { useAppStore } from '../../../../../store'

const NewMessage = () => {
    const {setSelectedChatType,setSelectedChatData} = useAppStore()

    const [openNewContact, setOpenNewContact] = useState(false)
    const [searchedContacts, setsearchedContacts] = useState([])

    const serachContacts = async (searchWord) => {
        try {
            if(searchWord.length > 0 ){
                const res = await apiClient.post(SEARCH_CONTACTS_ROUTES,{searchWord},{withCredentials:true})
            

                if (res.status === 200 && res.data.contacts){
                    setsearchedContacts(res.data.contacts)
                }
            }
            else {
                setsearchedContacts([])
            }
        } catch (error) {
            console.log("Error in the serachContacts/ new-message.jsx", error);
        }
    }


    const selectNewContact = (contact) =>{
        setOpenNewContact(false)
        setSelectedChatType("contact")
        setSelectedChatData(contact)
        setsearchedContacts([])
    }



  return (
    <>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <FaPlus
                        className='text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300 '
                        onClick={()=>setOpenNewContact(true)}
                    />
                </TooltipTrigger>

                <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white " >
                    Select New Contact
                </TooltipContent>

            </Tooltip>
        </TooltipProvider>


        <Dialog open={openNewContact} onOpenChange={setOpenNewContact} >
            <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col " >
                <DialogHeader>
                <DialogTitle className="flex items-center justify-center" >Search Contacts</DialogTitle>
                {/* <DialogDescription></DialogDescription> */}
                </DialogHeader>

                <div>
                    <Input 
                        placeholder='Search contact' 
                        className=' rounded-lg p-6 bg-[#2c2e3b] border-none  ' 
                        onChange={(e)=>serachContacts(e.target.value)}
                    />
                </div>

                {
                    searchedContacts.length > 0  && 
                    (<ScrollArea className='h-[250px]' >
                    <div className="flex flex-col gap-5  ">
                        {
                            searchedContacts.map(contact => 
                                
                                <div 
                                    key={contact._id} 
                                    className='flex gap-3 items-center cursor-pointer ' 
                                    onClick={()=>selectNewContact(contact)}
                                > 
                                    <div className="w-12 h-12 relative ">
                                        <Avatar className="h-12 w-12 rounded-full overflow-hidden  " >
                                            {
                                                contact.image ? <AvatarImage src={`${HOST}/${contact.image}`} alt="profilePic" className="object-cover w-full h-full bg-black rounded-full " /> 
                                                    : 
                                                    <div className= {`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`} >
                                                        { contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift() }
                                                    </div>
                                            }
                                        </Avatar>
                                    </div>
                                    <div className="flex flex-col ">
                                        <span>
                                            {
                                                contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : "Full name is not available "
                                            }
                                        </span>
                                        {/* <span>
                                            {
                                                contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email
                                            }
                                        </span> */}
                                        <span className=' text-xs' >
                                            {contact.email}
                                        </span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    </ScrollArea>)
                }

                {
                    searchedContacts.length <= 0 && 
                        <div className='flex-1 md:flex mt-5 md:mt-0 flex-col justify-center items-center duration-1000 transition-all ' >
                                <Lottie
                                    isClickToPauseDisabled={true}
                                    height={100}
                                    width={100}
                                    options={animationDefaultOptions}
                                />
                        
                                <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center ">
                                    <h3 className="poppins-medium">
                                        Hi <span className=' text-purple-500  ' >!</span> Find New  <span className=" text-purple-500 ">Contacts.</span>
                                    </h3>
                                </div>
                        
                            </div>
                }
            </DialogContent>
        </Dialog>


    </>
  )
}

export default NewMessage