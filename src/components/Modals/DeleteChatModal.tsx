"use client"

import { isOpenDeleteChatState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import { useConversation } from "@/hooks/useConversation"

export default function DeleteChatModal() {
  const [, setIsOpenDeleteChat] = useAtom(isOpenDeleteChatState)
  

  const { 
    onDeleteGroupChat
  } = useConversation()


  return(
    <div className="w-full h-full flex items-center justify-center text-red-500"
      onClick={() => setIsOpenDeleteChat(false)}
    >
      <div className="w-fit h-fit bg-white rounded-lg p-5 flex flex-col" onClick={(e) => {e.stopPropagation()}}>
        <div>Remove this group chat?</div>


        <div>This action can&apos;t be undo</div>

        <div className="flex w-full justify-evenly">
          <button
            onClick={() => setIsOpenDeleteChat(false)}
            className="flex items-center mt-5 gap-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-fit"
          >
            cancel
          </button>
          <button
            onClick={() => {
              setIsOpenDeleteChat(false)
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