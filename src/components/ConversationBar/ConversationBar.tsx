"use client"

import axios from "axios"
import Avatar from "../Avatar/Avatar"
import { API_SERVER } from "@/constants/constants"
import { useEffect, useState } from "react"
import { IConversation, IUser } from "@/constants/interface"
import { Video } from "lucide-react"
import { GroupType } from "@/constants/enum"
import { userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"

interface Props {
  conversationId: string | string[] | undefined
}

export default function ConversationBar({
  conversationId
}: Props) {
  const [user,] = useAtom(userState)
  const [displayName, setDisplayName] = useState<string>('')

  const [currentConversation, setCurrentConversation] = useState<IConversation>()
  const [allUsers, setAllUsers] = useState<IUser[]>([])
  const getConversationById = async () => {
    try {
      const response = await axios.get(`${API_SERVER}/conversation/${conversationId}`)
      setCurrentConversation(response.data.conversation)
      console.log('response.data.conversation', response.data.conversation.created_by)
    } catch (e) {
      console.error(e)
    }
  }

  const getAllUsersInConversation = async () => {
    try {
      const response = await axios.get(`${API_SERVER}/conversation/users/${conversationId}`)
      setAllUsers(response.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleClick = () => {
    const url = `/channel/${conversationId}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=700,height=700');
  };

  useEffect(() => {
    if (conversationId) {
      getConversationById()
      getAllUsersInConversation()
    }
  }, [conversationId])

  useEffect(() => {
    if (user && currentConversation) {
      if (currentConversation!.created_by === user?.id) {
        const name = allUsers.find(p => p.id !== user.id)
        setDisplayName(`${name?.username}`)
        console.log('name1', name?.username)
      } else {
        const name = allUsers.find(p => p.id === currentConversation!.created_by)
        setDisplayName(`${name?.username}`)
        console.log('name2', name?.username)
      }
    }

  }, [allUsers, currentConversation])

  return (
    <div className="w-full h-full px-5">
      <div className="w-full h-full border-b border-[#B4ABAB] flex items-center justify-between">
        <div className="flex">
          <div className="w-[50px] h-[50px]">
            <Avatar
              name={`${currentConversation?.name}`}
              avatar_url={`${currentConversation?.avatar_url}`}
            />
          </div>
          {currentConversation?.type === GroupType.GROUP ?
            <div className="w-fit h-full flex flex-col ml-3">
              <div className="font-bold text-xl h-full flex items-center">
                {currentConversation?.name}
              </div>
              <div>
                {allUsers.length} members
              </div>
            </div> :
            <div className="w-fit h-[50px] flex flex-col ml-3 font-bold text-xl items-center">
              <div className="h-full flex items-center">
                {displayName}
              </div>
            </div>
          }
        </div>

        <div className="flex items-center">
          <div
            className="w-[50px] h-[50px] flex items-center justify-center cursor-pointer hover:bg-slate-200 duration-300 transition-all rounded-full"
            onClick={handleClick}
          >
            <Video />
          </div>
        </div>
      </div>
    </div>
  )
}