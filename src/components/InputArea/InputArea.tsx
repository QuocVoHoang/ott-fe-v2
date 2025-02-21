"use client"

import { MessageType } from "@/constants/enum"
import { IMessage } from "@/constants/interface"
import { useUser } from "@/hooks/useUser"
import { useWebSocket } from "@/hooks/useWebSocket"
import { Paperclip, Send } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function InputArea() {
  const [input, setInput] = useState<string>('')
  const params = useParams();
  const {
    sendMessage
  } = useWebSocket()

  const {
    user
  } = useUser()

  const onSendMessage =async() => {
    const newSentMessage: IMessage = {
      conversation_id: `${params.id}`,
      sender_id: `${user?.id}`,
      content: input,
      type: MessageType.TEXT,
      file_url: ''
    }
    sendMessage(newSentMessage)
    setInput('')
  }

  return(
    <div className="w-full h-input-area-height border-t flex items-center focus:outline-none">
      <div className="w-[90%] h-full flex flex-col">
        <div className="w-full h-[40%]">
          <Paperclip className="cursor-pointer"/>
        </div>
        <input 
          placeholder="Type to text"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-[60%] px-2"
        />
      </div>
      <div 
        className="w-[10%] h-full flex items-center justify-center cursor-pointer bg-blue-200 hover:bg-blue-300 transition-all duration-300"
        onClick={onSendMessage}
      >
        <Send />
      </div>
    </div>
  )
}