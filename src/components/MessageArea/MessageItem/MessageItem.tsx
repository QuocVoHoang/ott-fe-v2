"use client"

import { IMessage, IUser } from "@/constants/interface"
import { userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import { JSX, useEffect, useRef, useState } from "react"
import useMessage from "../hook/useMessage"
import axios from "axios"
import { API_SERVER } from "@/constants/constants"
import Avatar from "@/components/Avatar/Avatar"
import Image from "next/image"
import { Code, EllipsisVertical, FileText } from "lucide-react"

interface Props {
  message: IMessage
  showAvatar: boolean
  deleteMessage: (messageId: string) => Promise<void>
}

export default function MessageItem({
  message,
  showAvatar,
  deleteMessage
}: Props) {
  const [user,] = useAtom(userState)
  const isUser = user?.id === message.sender_id
  const [sender, setSender] = useState<IUser>()
  const {
    getFileType
  } = useMessage()
  const [showPanel, setShowPanel] = useState<boolean>(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  const getUserById = async () => {
    try {
      const response = await axios.get(`${API_SERVER}/user/info-id/${message.sender_id}`)
      const user: IUser = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        avatarUrl: response.data.avatar_url
      }
      setSender(user)
    } catch (e) {
      console.error(e)
    }
  }

  const fileType = getFileType(message.file_url!)
  useEffect(() => {
    if (showAvatar === true) {
      getUserById()
    }
  }, [message])

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
    <div className={`w-full h-fit flex mt-1`}>
      {!isUser &&
        <div className={`w-[50px] h-[50px] rounded-full group cursor-pointer relative ${isUser ? 'ml-3' : 'mr-3'} ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
          <Avatar avatar_url={`${sender?.avatarUrl}`} name={`${sender?.username}`} />
        </div>
      }

      <div className={`w-full h-fit flex ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {message.content === '' ?
          <div className={`flex items-center`}>
            {fileType === "image" && <Image src={message.file_url!} alt="Uploaded File" width={300} height={300} />}
            {fileType === "video" && <video src={message.file_url!} controls width={300} height={300} />}
            {fileType === "audio" && <audio src={message.file_url!} controls className="w-[300px] h-[300px]" />}
            {fileType === "pdf" && <DownloadFile name={message.file_url!} icon={<FileText className="text-red-700" />} />}
            {fileType === "document" && <DownloadFile name={message.file_url!} icon={<FileText className="text-blue-700" />} />}
            {fileType === "text" && <DownloadFile name={message.file_url!} icon={<FileText className="text-green-700" />} />}
            {fileType === "code" && <DownloadFile name={message.file_url!} icon={<Code className="text-gray-700" />} />}
            {fileType === "unknown" && <p>Unknow file</p>}
          </div> :
          <div className="flex items-center min-h-[50px] max-w-[60%]">
            <div className={`w-fit h-fit min-h-[50px] flex items-center p-2 ${isUser ? 'bg-[#6E00FF] text-white' : 'bg-[#E7E7E7] text-[#303030]'} rounded-lg`}>
              {message.content}
            </div>
          </div>
        }

        {isUser && <div className="flex items-center">
          <div
            className={`h-[50px] hover:bg-slate-200 rounded-lg cursor-pointer flex items-center transition-all duration-300 relative`}
            onClick={() => setShowPanel(prev => !prev)}
            ref={buttonRef}
          >
            <EllipsisVertical className="h-[15px]" />
          </div>
        </div>}

        {showPanel &&
          <div className="flex items-center">
            <div className="w-fit mx-2 h-[50px] rounded-lg border border-[#BDBDBD]" ref={panelRef}>
              <div className="h-[25px] px-2 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all duration-300 rounded-t-lg">
                Edit
              </div>
              <div
                className="h-[25px] px-2 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all duration-300 rounded-b-lg"
                onClick={() => {
                  deleteMessage(message.id!)
                  setShowPanel(false)
                }}
              >
                Delete
              </div>
            </div>
          </div>
        }
      </div>


    </div>
  )
}

function DownloadFile({ name, icon }: { name: string, icon: JSX.Element }) {
  return (
    <a className="w-[500px] flex justify-end overflow-hidden whitespace-nowrap text-ellipsis my-2"
      href={name}
    >
      <div className="w-fit h-fit flex hover:bg-slate-200 cursor-pointer transition-all duration-300 p-2 rounded-lg">
        <div>
          {icon}
        </div>
        <div className="font-bold ml-2">
          {name.split("-2025-")[1]}
        </div>
      </div>
    </a>
  )
}