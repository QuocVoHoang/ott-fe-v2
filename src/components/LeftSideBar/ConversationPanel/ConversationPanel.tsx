"use client"

import { ModalType } from "@/constants/enum"
import { isOpenModalState, modalTypeState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"

export default function ConversationPanel() {
  const [, setIsOpenModal] = useAtom(isOpenModalState)
  const [, setModalType] = useAtom(modalTypeState)

  return(
    <div className="w-[100px] h-fit bg-white border border-[#BDBDBD] rounded-lg">
      <div className="w-full h-fit p-1 flex justify-center items-center hover:bg-slate-100 rounded-lg cursor-pointer"
        onClick={() => {
          setModalType(ModalType.UPDATECHAT)
          setIsOpenModal(true)
        }}
      >
        Edit chat
      </div>
      <div className="w-full h-fit p-1 pt-0 flex justify-center items-center hover:bg-slate-100 rounded-lg cursor-pointer"
        onClick={() => {
          setModalType(ModalType.DELETECHAT)
          setIsOpenModal(true)
        }}
      >
        Delete chat
      </div>
    </div>
  )
}