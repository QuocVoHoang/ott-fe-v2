"use client"

import { IMessage, IUser } from "@/constants/interface"
import { useWebSocket } from "@/hooks/useWebSocket"
import { userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import Avatar from "../Avatar/Avatar"
import axios from "axios"
import { API_SERVER } from "@/constants/constants"

export default function MessageArea() {
  const {
    messages,
    messagesEndRef
  } = useWebSocket()

  return (
    <div className="w-full h-full p-5 overflow-auto relative">
      {messages.map((message, index) => 
        {
          let showAvatar = true
          if(index > 0) {
            showAvatar = messages[index-1].sender_id === message.sender_id ? false : true
          } else {
            showAvatar = true
          }
          return (
            <Message 
              key={index}
              message={message} 
              showAvatar={showAvatar}
            />
          )
        }
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

function Message({message, showAvatar}: {message: IMessage, showAvatar: boolean}){
  const [user , ] = useAtom(userState)
  const isUser = user?.id === message.sender_id

  const [sender, setSender] = useState<IUser>()

  const getUserById =async() => {
    try {
      const response = await axios.get(`${API_SERVER}/user/info-id/${message.sender_id}`)
      const user: IUser = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        avatarUrl: response.data.avatar_url
      }
      setSender(user)
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if(showAvatar === true) {
      getUserById()
    }
  }, [message])

  return(
    <div className={`w-full h-fit flex  mt-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && 
        <div className={`w-10 h-10 bg-red-300 rounded-full group cursor-pointer relative ${isUser ? 'ml-3' : 'mr-3'} ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
          <Avatar avatar_url={`${sender?.avatarUrl}`} name={`${sender?.username}`}/>
        </div>
      }
      <div className={`max-w-[60%] w-fit h-fit p-2 ${isUser ? 'bg-[#6E00FF] text-white' : 'bg-[#E7E7E7] text-[#303030]'} rounded-lg`}>
        {message.content}
      </div>
    </div>
  )
}

