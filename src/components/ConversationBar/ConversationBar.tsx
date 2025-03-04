"use client"

import axios from "axios"
import Avatar from "../Avatar/Avatar"
import { API_SERVER } from "@/constants/constants"
import { useEffect, useState } from "react"
import { IConversation } from "@/constants/interface"
import { Phone, Video } from "lucide-react"

interface Props {
  conversationId: string | string[] | undefined
}

export default function ConversationBar({
  conversationId
}: Props) {
  const [currentConversation, setCurrentConversation] = useState<IConversation>()
  const getConversationById =async() => {
    try {
      const response = await axios.get(`${API_SERVER}/conversation/${conversationId}`)
      setCurrentConversation(response.data)
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if(conversationId) {
      getConversationById()
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
          <div className="w-fit h-full flex flex-col"> 
            <div>
              {currentConversation?.name}
            </div>
            <div>
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