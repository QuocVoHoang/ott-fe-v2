"use client"

import { GroupType } from "@/constants/enum"
import { IConversation } from "@/constants/interface"
import { conversationsState, userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

export default function useFriendList() {
  const [user,] = useAtom(userState)

  const [conversations, ] = useAtom(conversationsState)
  const [cons, setCons] = useState<IConversation[]>([])

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      const filtered = conversations.filter(c => c.type === GroupType.PRIVATE);
      setCons(filtered);
    }
  }, [conversations])



  return {
    user: user,
    conversations: cons,
    // onAcceptFriendRequest: onAcceptFriendRequest,
    // onDeleteFriendRequest: onDeleteFriendRequest
  }
}