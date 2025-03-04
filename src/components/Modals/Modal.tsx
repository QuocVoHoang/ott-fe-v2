"use client"

import { ModalType } from "@/constants/enum"
import { modalTypeState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import NewChatModal from "./NewChatModal"
import DeleteChatModal from "./DeleteChatModal"

export default function Modal(){
  const [modalType, ] = useAtom(modalTypeState)
  return(
    <div className="w-full h-full">
      {modalType === ModalType.NEWCHAT && <NewChatModal />}
      {modalType === ModalType.DELETECHAT && <DeleteChatModal />}
    </div>
  )
}