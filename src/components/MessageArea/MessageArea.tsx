"use client"

import { useUser } from "@/hooks/useUser"
import { useEffect, useState } from "react"
import { IMessage, IUser } from "@/constants/interface"
import Image from "next/image"
import { useAtom } from "jotai"
import { currentMessagesState } from "@/jotai/jotai-state"

export default function MessageArea() {
  const [messages, ] = useAtom(currentMessagesState)

  return (
    <div className="w-full h-message-area-height p-5 overflow-auto relative">
      {messages.map((message, index) => 
        {
          return (
            <Message key={index} message={message}/>
          )
        }
      )}
    </div>
  )
}

function Message({message}: {message: IMessage}){
  const {
    user,
    getUserById
  } = useUser()

  const isUser = user?.id === message.sender_id
  const [sender, setSender] = useState<IUser>()

  const getSender =async() => {
    const response = await getUserById(message.sender_id)
    setSender(response)
  }

  useEffect(() => {
    getSender()
  }, [message])
  
  return(
    <div className={`w-full h-fit flex  mt-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-10 h-10 bg-red-300 rounded-full group cursor-pointer relative ${isUser ? 'ml-3' : 'mr-3'}`}>
        <div className={`absolute flex items-center w-fit px-2 h-5 bg-red-300 top-0 ${isUser ? 'right-0' : 'left-0'} rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300`}>
          {sender?.username}
        </div>
        {sender?.avatarUrl && sender.avatarUrl.startsWith("http") ? (
          <Image src={sender.avatarUrl} alt="" className="w-full h-full" width={40} height={40} />
        ) : (
          <div className="font-extrabold text-black text-xl w-full h-full flex items-center justify-center">
            {sender?.username.charAt(0)}
          </div>
        )}
      </div>
      <div className="max-w-[60%] w-fit h-fit p-2 bg-red-300 rounded-lg">
        {message.content}
      </div>
    </div>
  )
}

