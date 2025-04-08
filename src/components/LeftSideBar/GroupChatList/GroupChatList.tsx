"use client"

import Avatar from "@/components/Avatar/Avatar"
import useChatList from "./hooks/useChatList"
import { EllipsisVertical } from "lucide-react"
import { useRouter } from "@/i18n/routing"
import { useEffect, useRef, useState } from "react"
import ConversationPanel from "../ConversationPanel/ConversationPanel"
import { IConversation } from "@/constants/interface"

export default function GroupChatList() {
  const {
    conversations,
  } = useChatList()

  return (
    <div className="w-full h-full bg-white rounded-[25px] p-2 shadow-[0px_4px_5px_2px_rgba(121,197,239,0.38)] relative">
      <div className="font-bold">Groups</div>
      {conversations.length > 0 && conversations.map((conversation, index) => (
        <ChatItem
          key={index}
          conversation={conversation}
        />
      ))}
    </div>
  )
}

interface Props {
  conversation: IConversation
}

function ChatItem({
  conversation
}: Props) {
  const router = useRouter()

  const [showPanel, setShowPanel] = useState<boolean>(false)
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const formatDateTime = (datetimeStr: string): string => {
    const inputDate = new Date(datetimeStr);
    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear();
  
    let hours = inputDate.getHours();
    const minutes = inputDate.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  
    const formattedTime = `${hours}:${minutes} ${amPm}`;
    const formattedDate = `${day}/${month}/${year} - ${formattedTime}`;
  
    return formattedDate
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPanel]);

  return (
    <div
      className="w-full h-[60px] flex items-center flex-row justify-center border-b border-[#BDBDBD] group hover:bg-slate-100 rounded-lg cursor-pointer mb-2 transition-all duration-200"
      onClick={() => router.push(`/chat/${conversation.id}`)}
    >
      <div className="w-[50px] h-[50px] ">
        <Avatar name={conversation.name} avatar_url={conversation.avatar_url} />
      </div>

      <div className="w-chat-item h-full flex flex-col justify-center px-3 overflow-hidden">
        <div className="text-black font-bold flex flex-row justify-between">
          {conversation.name}
          <div className="text-gray-600 font-normal">
            {formatDateTime(conversation.updated_at)}
          </div>
        </div>
        <div className="text-gray-600 flex justify-between">
          preview
          <div className="w-[20px] h-full flex items-center ">
            <div className="w-[20px] h-[20px] rounded-full bg-red-600 flex items-center justify-center text-white font-normal">
              1
            </div>
          </div>
        </div>
      </div>

      <div className="w-[20px] h-full flex items-center cursor-pointer hover:bg-slate-100 rounded relative"
        ref={buttonRef}
        onClick={() => {
          setShowPanel(prev => !prev)
        }}
      >
        <EllipsisVertical />
        {showPanel &&
          <div className="absolute top-[-55px] right-0 z-50" ref={panelRef}>
            <ConversationPanel />
          </div>
        }
      </div>
    </div>
  )
}

