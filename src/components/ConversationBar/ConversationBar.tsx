"use client"

import axios from "axios"
import Avatar from "../Avatar/Avatar"
import { API_SERVER } from "@/constants/constants"
import { useEffect, useState } from "react"
import { IConversation, IUser } from "@/constants/interface"
import { Phone, Video } from "lucide-react"
import { GroupType } from "@/constants/enum"

interface Props {
  conversationId: string | string[] | undefined
}

export default function ConversationBar({
  conversationId
}: Props) {
  const [currentConversation, setCurrentConversation] = useState<IConversation>()
  const [allUsers, setAllUsers] = useState<IUser[]>([])
  const getConversationById =async() => {
    try {
      const response = await axios.get(`${API_SERVER}/conversation/${conversationId}`)
      setCurrentConversation(response.data.conversation)
    } catch(e) {
      console.error(e)
    }
  }
  
  const getAllUsersInConversation =async() => {
    try {
      const response = await axios.get(`${API_SERVER}/conversation/users/${conversationId}`)
      setAllUsers(response.data)
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if(conversationId) {
      getConversationById()
      getAllUsersInConversation()
    }
  }, [conversationId])

  return(
    <div className="w-full h-full px-5">
      <div className="w-full h-full border-b border-[#B4ABAB] flex items-center justify-between">
        <div className="flex">
          <div className="w-[50px] h-[50px]">
            <Avatar 
              name={`${currentConversation?.name}`}
              avatar_url={`${currentConversation?.avatar_url}`}
            />
          </div>
          <div className="w-fit h-full flex flex-col ml-3"> 
            <div className="font-bold text-xl">
              {currentConversation?.name}
            </div>
            <div>
              {currentConversation?.type === GroupType.GROUP && `${allUsers.length} members`}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-[50px] h-[50px] flex items-center justify-center cursor-pointer hover:bg-slate-200 duration-300 transition-all rounded-full">
            <Phone />
          </div>
          <div className="w-[50px] h-[50px] flex items-center justify-center cursor-pointer hover:bg-slate-200 duration-300 transition-all rounded-full">
            <Video />
          </div>
        </div>
      </div>
    </div>
  )
}