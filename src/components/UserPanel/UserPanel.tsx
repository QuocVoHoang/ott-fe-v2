"use client"

import { userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"

export default function UserPanel() {
  const [user, ] = useAtom(userState)
  return (
    <div
      className="bg-white w-fit h-fit rounded-lg border border-[#DBDBDB] flex flex-col px-3"
    >
      <div className="py-2 text-black font-bold text-xl">
        {user?.username}
      </div>
      <div className="text-gray-600 text-sm pb-2">
        {user?.email}
      </div>
    </div>
  )
}