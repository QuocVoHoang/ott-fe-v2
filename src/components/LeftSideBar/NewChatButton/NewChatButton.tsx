"use client"

import { isOpenNewChatState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"

export default function NewChatButton() {
  const [, setIsOpenNewChat] = useAtom(isOpenNewChatState)
  return(
    <div 
      className="w-full h-newchat-button hover:bg-gray-300 cursor-pointer transition-all duration-300 flex items-center justify-center"
      onClick={() => setIsOpenNewChat(true)}
    >
      new chat
    </div>
  )
}