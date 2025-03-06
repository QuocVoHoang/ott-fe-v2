"use client"

import ConversationBar from "@/components/ConversationBar/ConversationBar"
import InputArea from "@/components/InputArea/InputArea"
import MessageArea from "@/components/MessageArea/MessageArea"
import { useParams } from "next/navigation"

export default function Page() {
  const { id: conversationId } = useParams()
  return (
    <div className="w-full h-full flex flex-col justify-between bg-white rounded-xl">
      <div className="w-full h-chatbar">
        <ConversationBar 
          conversationId={conversationId}
        />
      </div>
      <div className="w-full h-message-area-height">
        <MessageArea />
      </div>
      <div className="w-full h-input-area-height">
        <InputArea />
      </div>
    </div>
  )
}