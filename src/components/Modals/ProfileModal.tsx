"use client"

import { isOpenProfileState, userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import InputField from "../InputField/InputField"
import { useState } from "react"
import { useUser } from "@/hooks/useUser"
import Avatar from "../Avatar/Avatar"

export default function ProfileModal() {
  const [, setIsOpenProfile] = useAtom(isOpenProfileState)
  const [user , setUser] = useAtom(userState)
  const [isEditName, setIsEditName] = useState<boolean>(false)
  const [newUsername, setNewUsername] = useState<string>(`${user?.username}`)

  const {
    onChangeUsername,
    onChangeUserAvatar
  } = useUser()

  return(
    <div className="w-full h-full flex items-center justify-center text-red-500"
      onClick={() => setIsOpenProfile(false)}
    >
      <div className="w-fit h-fit bg-white rounded-lg p-5 flex flex-col" onClick={(e) => {e.stopPropagation()}}>
        {user?.email}
        <div className="flex">
          <InputField 
            placeholder="User name"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <button
            onClick={()=> {
              onChangeUsername(newUsername)
              setNewUsername('')
            }}
          >update</button>
        </div>
        <div className="w-28 h-28 rounded-full text-5xl">
          <Avatar name={`${user?.username}`} avatar_url={`${user?.avatarUrl}`}/>
        </div>
        <button
            onClick={()=> {
              onChangeUserAvatar('https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png')
            }}
          >update</button>
      </div>
    </div>
  )
}