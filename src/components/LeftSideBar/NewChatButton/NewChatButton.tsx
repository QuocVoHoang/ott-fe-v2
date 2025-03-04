"use client"

import { ModalType } from "@/constants/enum"
import { isOpenModalState, modalTypeState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"

export default function NewChatButton() {
  const [, setIsOpenModal] = useAtom(isOpenModalState)
  const [, setModalType] = useAtom(modalTypeState)

  return (
    <div 
      className="w-full h-new-chat-button bg-white rounded-[25px] p-2 shadow-[0px_4px_5px_2px_rgba(121,197,239,0.38)] flex items-center justify-center cursor-pointer hover:bg-slate-100 duration-300 transition-all"
      onClick={() => {
        setModalType(ModalType.NEWCHAT)
        setIsOpenModal(true)
      }}  
    >
      + New chat
    </div>
  )
}