'use client'

import { API_SERVER } from "@/constants/constants"
import { IUser } from "@/constants/interface"
import { userState } from "@/jotai/jotai-state"
import axios from "axios"
import { useAtom } from "jotai"
import { useState } from "react"

export const useUser =() => {
  const [user , ] = useAtom(userState)
  const [conversationUsers, setConversationUsers] = useState<IUser[]>([])
  
  const checkExistingUser = async (participants: string[]) => {
    const response = await axios.post('/api/users', {
      participants: participants
    })
    return response.data
  }

  const loadUsersInConversation =async(conversationId: string) => {
    try {
      const response = await axios.get(`${API_SERVER}/conversation/users/${conversationId}`)
      setConversationUsers(response.data)
    } catch(e) {
      console.error(e)
    }
  }

  const getUserById =async(user_id: string) => {
    try {
      const response = await axios.get(`${API_SERVER}/user/info-id/${user_id}`)
      return response.data
    } catch(e) {
      console.error(e)
    }
  }

  return {
    user,
    conversationUsers,

    checkExistingUser,
    loadUsersInConversation,
    getUserById
  }
}