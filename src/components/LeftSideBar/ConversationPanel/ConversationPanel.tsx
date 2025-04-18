"use client"

import { API_SERVER } from "@/constants/constants"
import { GroupType, ModalType } from "@/constants/enum"
import { IConversation } from "@/constants/interface"
import { isOpenModalState, modalTypeState, userState } from "@/jotai/jotai-state"
import axios from "axios"
import { useAtom } from "jotai"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ConversationPanel() {
  const [, setIsOpenModal] = useAtom(isOpenModalState)
  const [, setModalType] = useAtom(modalTypeState)
  const [user,] = useAtom(userState)
  const { id: conversationId } = useParams()
  const [con, setCon] = useState<IConversation>()

  const [isUser, setIsUser] = useState<boolean>(false)
  const getConversationById =async() => {
    try {
      const response = await axios.get(`${API_SERVER}/conversation/${conversationId}`)
      setCon(response.data.conversation)
      console.log(response.data)
      if(user?.id === response.data.conversation.created_by) {
        setIsUser(true)
      } else {
        setIsUser(false)
      }
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getConversationById()
  },[])

  return(
    <div className="w-[100px] h-fit bg-white border border-[#BDBDBD] rounded-lg mt-5">
      <div className="w-full h-fit p-1 flex justify-center items-center hover:bg-slate-100 rounded-lg cursor-pointer"
        onClick={() => {
          setModalType(ModalType.UPDATECHAT)
          setIsOpenModal(true)
        }}
      >
        Edit chat
      </div>
      {(isUser && con?.type === GroupType.GROUP) && 
        <div className="z-50 w-full h-fit p-1 pt-0 flex justify-center items-center hover:bg-slate-100 rounded-lg cursor-pointer"
          onClick={() => {
            setModalType(ModalType.DELETECHAT)
            setIsOpenModal(true)
          }}
        >
          Delete chat
        </div>
      }
    </div>
  )
}