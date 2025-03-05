"use client"

import { API_SERVER } from "@/constants/constants"
import { useRouter } from "@/i18n/routing"
import { isOpenModalState } from "@/jotai/jotai-state"
import axios from "axios"
import { useAtom } from "jotai"
import { X } from "lucide-react"
import { useParams } from "next/navigation"

export default function DeleteChatModal() {
  const [, setIsOpenModal] = useAtom(isOpenModalState)
  const { id: conversationId } = useParams()
  const router = useRouter()

  const onDeleteGroupChat = async() => {
    try {
      await axios.delete(`${API_SERVER}/conversation/${conversationId}`)
      router.push('/')
    } catch (e) {
      console.error(e)
    }
  }

  return(
    <div className="w-full h-full flex items-center justify-center text-red-500"
      onClick={() => setIsOpenModal(false)}
    >
      <div className="w-fit h-fit bg-white rounded-lg flex flex-col" onClick={(e) => {e.stopPropagation()}}>
        <div className="w-[300px] flex justify-between px-5 py-3 border-b brder-[#BDBDBD]">
          <div className="text-black font-bold ">Remove this group chat?</div>
          <div className="text-black font-bold rounded-full hover:bg-slate-300 cursor-pointer transition-all duration-300"
            onClick={() => setIsOpenModal(false)}
          >
            <X />
          </div>
        </div>


        <div className="px-5 py-2">This action can&apos;t be undo</div>

        <div className="flex w-full px-5 pb-5 justify-end">
          <button
            onClick={() => setIsOpenModal(false)}
            className="mr-2 flex items-center mt-5 gap-2 p-2 text-[#303030] border border-[#BDBDBD] rounded-lg hover:bg-slate-100 transition-all duration-300 w-fit"
          >
            cancel
          </button>
          <button
            onClick={() => {
              setIsOpenModal(false)
              onDeleteGroupChat()
            }}
            className="flex items-center mt-5 gap-2 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 w-fit"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}