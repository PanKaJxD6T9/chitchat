import React, { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { FaPlus } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { animationDefaultOptions, getColor } from '@/lib/utils';
import Lottie from 'react-lottie';
import { apiClient } from '@/lib/api-client';
import { HOST, SEARCH_CONTACTS_ROUTE } from '@/utils/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store';

const NewDM = () => {

  const {setSelectedChatType, setSelectedChatData} = useAppStore();

  const [openNewContainerModel, setOpenNewContainerModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([])
  const searchContacts = async(searchTerm)=>{
    try{
      if(searchTerm.length > 0){
        const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, {searchTerm}, {withCredentials: true});
        if(response.status === 200 && response.data.contacts){
          setSearchedContacts(response.data.contacts)
        }
      } else {
        setSearchedContacts([]);
      }
    } catch(err){
      console.log(err)
    }
  };

  const selectNewContact = (contact)=>{ 
    setOpenNewContainerModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([])
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContainerModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] text-white border-none mb-2 p-3">
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={openNewContainerModel}
        onOpenChange={setOpenNewContainerModel}
      >
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please Select a Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="">
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2a3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {
            searchedContacts.length>0 && 
          <ScrollArea className="h-[250px] ">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  onClick={()=>selectNewContact(contact)}
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer"
                >
                  <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                        <div
                          className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                            contact.color
                          )}`}
                        >
                          {contact.firstname
                            ? contact.firstname.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstname && contact.lastname
                        ? `${contact.firstname} ${contact.lastname}`
                        : contact.email}
                    </span>
                    <span className='text-xs'>{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          }
          {searchedContacts.length <= 0 && (
            <div className="flex-1 md:flex flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={200}
                width={200}
                options={animationDefaultOptions}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewDM