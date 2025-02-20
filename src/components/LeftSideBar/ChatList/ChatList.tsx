"use client"
import { IConversation } from "@/constants/interface"
import ChatItem from "../ChatItem/ChatItem"

interface Props {
  conversations: IConversation[]
}

export default function ChatList({conversations}: Props) {
  
  return(
    <div className={`w-full h-chatlist-height flex flex-col p-0 m-0`}>
      <div className="w-full h-full flex flex-col">
        {conversations.length > 0 && conversations.map((conversation, index) => 
          <ChatItem key={index} item={conversation}/>
        )}
      </div>
    </div>
  )
}