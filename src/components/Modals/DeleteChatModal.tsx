"use client"

import { API_SERVER } from "@/constants/constants"
import { useRouter } from "@/i18n/routing"
import { isOpenModalState } from "@/jotai/jotai-state"
import axios from "axios"
import { useAtom } from "jotai"
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
      <div className="w-fit h-fit bg-white rounded-lg p-5 flex flex-col" onClick={(e) => {e.stopPropagation()}}>
        <div>Remove this group chat?</div>


        <div>This action can&apos;t be undo</div>

        <div className="flex w-full justify-evenly">
          <button
            onClick={() => setIsOpenModal(false)}
            className="flex items-center mt-5 gap-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-fit"
          >
            cancel
          </button>
          <button
            onClick={() => {
              setIsOpenModal(false)
              onDeleteGroupChat()
            }}
            className="flex items-center mt-5 gap-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-fit"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}