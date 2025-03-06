"use client"

import { MessageType } from "@/constants/enum"
import { IMessage } from "@/constants/interface"
import { useWebSocket } from "@/hooks/useWebSocket"
import { userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import { Send, Laugh, Camera } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import UploadFile from "../UploadFile/UploadFile"

export default function InputArea() {
  const [input, setInput] = useState<string>('')
  const params = useParams();
  const {
    sendMessage
  } = useWebSocket()

  const [user , ] = useAtom(userState)
  const [fileUrl, setFileUrl] = useState<string>('')

  const onChangeFileUrl =(url: string) => {
    setFileUrl(url)
  }

  const onSendMessage =async() => {
    if(input !== '' || fileUrl !== '') {
      const newSentMessage: IMessage = {
        conversation_id: `${params.id}`,
        sender_id: `${user?.id}`,
        content: input,
        type: MessageType.TEXT,
        file_url: fileUrl
      }
      sendMessage(newSentMessage)
      setInput('')
      setFileUrl('')
    }
  }

  useEffect(() => {
    onSendMessage()
  }, [fileUrl])

  return(
    <div className="w-full h-full p-3 flex">
      <div className="w-full h-full bg-[#EFF6FC] flex flex-row items-center rounded-full">
        <UploadFile onChangeFileUrl={onChangeFileUrl}/>
        <div className="w-chat-input h-full flex items-center">
          <input 
            placeholder="Type to text"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                onSendMessage()
            }}}
            className="w-full h-full px-2 text-black bg-[#EFF6FC] focus:outline-none"
          />
        </div>
        <div className="w-[50px] h-[50px] flex justify-center items-center cursor-pointer rounded-full hover:bg-[#a6cbeb] transition-all duration-300">
          <Laugh className="text-gray-600 "/>
        </div>
        <div className="w-[50px] h-[50px] flex justify-center items-center cursor-pointer rounded-full hover:bg-[#a6cbeb] transition-all duration-300">
          <Camera className="text-gray-600 "/>
        </div>
      </div>
      <div
        onClick={onSendMessage}
        className="w-[80px] h-full flex justify-center items-center cursor-pointer rounded-lg hover:bg-[#a6cbeb] transition-all duration-300"
      >
        <Send className="text-gray-600"/>
      </div>
    </div>
  )
}