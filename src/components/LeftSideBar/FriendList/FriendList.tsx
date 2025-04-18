"use client"

import Avatar from "@/components/Avatar/Avatar"
import { EllipsisVertical } from "lucide-react"
import { useRouter } from "@/i18n/routing"
import { useEffect, useRef, useState } from "react"
import ConversationPanel from "../ConversationPanel/ConversationPanel"
import { IConversation, IUser } from "@/constants/interface"
import { API_SERVER } from "@/constants/constants"
import axios from "axios"
import useFriendList from "./hooks/useFriendList"
import { useAtom } from "jotai"
import { userState } from "@/jotai/jotai-state"

export default function FriendList() {
  const {
    conversations,
  } = useFriendList()

  return (
    <div className="w-full h-full bg-white rounded-[25px] p-2 shadow-[0px_4px_5px_2px_rgba(121,197,239,0.38)] relative">
      <div className="font-bold h-[10%]">Friend</div>
      <div className="h-[90%] overflow-auto">
        {conversations.length > 0 && conversations.map((conversation, index) => (
          <ChatItem
            key={index}
            conversation={conversation}
          />
        ))}
      </div>
    </div>
  )
}

interface Props {
  conversation: IConversation
}

function ChatItem({
  conversation
}: Props) {
  const [user,] = useAtom(userState)

  const [displayName, setDisplayName] = useState<string>('')
  const [allUsers, setAllUsers] = useState<IUser[]>([])
  const getAllUsersInConversation = async () => {
    try {
      const response = await axios.get(`${API_SERVER}/conversation/users/${conversation.id}`)
      setAllUsers(response.data)
    } catch (e) {
      console.error(e)
    }
  }

  const router = useRouter()
  const [preview, setPreview] = useState<string>('')
  const onGetPreview = async () => {
    try {
      const response = await axios.get(`${API_SERVER}/message/get-mess/${conversation.last_message_id}`)
      if (response) {
        setPreview(response.data.content)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getAllUsersInConversation()
    onGetPreview()
  }, [])

  useEffect(() => {
    if (conversation.created_by === user?.id) {
      const name = allUsers.find(p => p.id !== user.id)
      setDisplayName(`${name?.username}`)
    } else {
      const name = allUsers.find(p => p.id === conversation.created_by)
      setDisplayName(`${name?.username}`)
    }
  }, [allUsers])

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

      <div className="w-chat-item h-full flex flex-col justify-center px-3 overflow-hidden mr-[20px]">
        <div className="text-black font-bold flex flex-row justify-between">
          {/* {conversation.name} */} {displayName}
          <div className="text-gray-600 font-normal text-xs" >
            {formatDateTime(conversation.updated_at)}
          </div>
        </div>
        <div className="text-gray-600 flex justify-between">
          {preview && preview}
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
          <div className="absolute top-[-20px] right-0 z-50" ref={panelRef}>
            <ConversationPanel />
          </div>
        }
      </div>
    </div>
  )
}

