"use client"

import { API_SERVER } from "@/constants/constants"
import { conversationsState, userState } from "@/jotai/jotai-state"
import axios from "axios"
import { useAtom } from "jotai"
import { useEffect } from "react"

export default function useChatList() {
  const [user, ] = useAtom(userState)
  const [conversations, setConversations] = useAtom(conversationsState)

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

  return {
    conversations: conversations,
    setConversations: setConversations
  }
}