"use client"

import { API_SERVER } from "@/constants/constants"
import { IFriend } from "@/constants/interface"
import { userState } from "@/jotai/jotai-state"
import axios from "axios"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

export default function useFriendList() {
  const [user,] = useAtom(userState)
  const [allFriends, setAllFriends] = useState<IFriend[]>([])

  const loadAllFriendList = async () => {
    try {
      if (user) {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_SERVER}/friend/friend-list`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response) {
          console.log(response.data)
          setAllFriends(response.data)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onAcceptFriendRequest = async (friendship_id: string, receiver_id: string) => {
    if (receiver_id === user?.id) {
      try {
        if (user) {
          const token = localStorage.getItem('token')
          const response = await axios.put(`${API_SERVER}/friend/accept/${friendship_id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if(response) {
            window.location.reload()
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  const onDeleteFriendRequest = async (friendship_id: string) => {
    try {
      if (user) {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${API_SERVER}/friend/remove/${friendship_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if(response) {
          window.location.reload()
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadAllFriendList()
  }, [user])

  return {
    user: user,
    allFriends: allFriends,
    onAcceptFriendRequest: onAcceptFriendRequest,
    onDeleteFriendRequest: onDeleteFriendRequest
  }
}