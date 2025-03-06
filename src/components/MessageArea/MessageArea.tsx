"use client"

import { useWebSocket } from "@/hooks/useWebSocket"
import MessageItem from "./MessageItem/MessageItem"

export default function MessageArea() {
  const {
    messages,
    messagesEndRef,
    deleteMessage,
  } = useWebSocket()

  return (
    <div className="w-full h-full p-5 overflow-auto relative">
      {messages.map((message, index) => 
        {
          let showAvatar = true
          if(index > 0) {
            showAvatar = messages[index-1].sender_id === message.sender_id ? false : true
          } else {
            showAvatar = true
          }
          return (
            <MessageItem 
              key={index}
              message={message} 
              showAvatar={showAvatar}
              deleteMessage={deleteMessage}
            />
          )
        }
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}


