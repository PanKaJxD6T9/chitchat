import { useSocket } from '@/context/socketContext'
import { apiClient } from '@/lib/api-client'
import { useAppStore } from '@/store'
import { UPLOAD_FILE_ROUTE } from '@/utils/constants'
import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useRef, useState } from 'react'
import {GrAttachment} from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import { RiEmojiStickerLine } from 'react-icons/ri'

const MessageBar = () => {

  const socket = useSocket();
  const {selectedChatType, selectedChatData, userInfo} = useAppStore();
  const [message, setMessage] = useState("");
  const emojiRef = useRef()
  const fileInputRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(()=>{
    function handleClickOutside(event){
      if(emojiRef.current && !emojiRef.current.contains(event.target)){
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return ()=>{
      document.removeEventListener("mousedown",  handleClickOutside);
    }

  }, [emojiRef]);

  const handleAddEmoji = (emoji)=>{
    setMessage((msg)=>msg+emoji.emoji);
  };

  const handleAttachment = ()=>{
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange = async(event)=>{
    try{

      const file = event.target.files[0]
      if(file){
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData,{withCredentials: true});

        if(response.status === 200 && response.data){
          if(selectedChatType === "contact"){
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
        }

      }

    } catch(err){
      console.log(err);
    }
  }

  const handleSendMessage = async()=>{
    if(selectedChatType === 'contact'){
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
  };

  return (
    <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-4 mb-2 gap-2 max-sm:w-[100%]'>
      <div className="flex flex-1 bg-[#2a2b33] rounded-md justify-center items-center gap-3 pr-3 mx-1">
        <input type="text" className='flex flex-1 p-3 bg-transparent rounded-md focus:border-none focus:outline-none' placeholder='Enter Message' value={message} onChange={(e)=>setMessage(e.target.value)}/>
        <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
          <GrAttachment className='text-2xl' onClick={handleAttachment}/>
        </button>
        <input type="file" className='hidden' ref={fileInputRef} name="" id="" onChange={handleAttachmentChange} />
        <div className="relative">
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={()=>setEmojiPickerOpen(true)}>
            <RiEmojiStickerLine className='text-2xl'/>
          </button>
          <div className='absolute bottom-16 right-0 max-sm:right-[-50px]'  ref={emojiRef}>
            <EmojiPicker className=''  theme='dark' open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false}/>
          </div>
        </div>
        
      </div>
      <button className='bg-[#8417ff] rounded-md flex items-center justify-center p-2 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={handleSendMessage}>
        <IoSend className='text-2xl' onClick={()=>setMessage("")}/>
      </button>
    </div>
  )
}

export default MessageBar
