"use client"

import { API_SERVER } from "@/constants/constants"
import { GroupType } from "@/constants/enum"
import { IConversation } from "@/constants/interface"
import { conversationsState, userState } from "@/jotai/jotai-state"
import axios from "axios"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

export default function useChatList() {
  const [user, ] = useAtom(userState)
  const [conversations, setConversations] = useAtom(conversationsState)
  const [cons, setCons] = useState<IConversation[]>([])

  const loadConversationsOfUser =async() => {
    try {
      if(user){
        const response = await axios.get(`${API_SERVER}/user/${user?.email}/conversations`)
        setConversations(response.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadConversationsOfUser()
  }, [user])

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      const filtered = conversations.filter(c => c.type === GroupType.GROUP);
      console.log(filtered)
      setCons(filtered);
    }
  }, [conversations])

  return {
    conversations: cons!,
    setConversations: setConversations
  }
}