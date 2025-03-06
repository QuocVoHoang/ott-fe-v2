"use client"

import { isOpenModalState, userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import { X } from "lucide-react"
import InputField from "../InputField/InputField"
import { useEffect, useState } from "react"
import axios from "axios"
import { API_SERVER } from "@/constants/constants"
import UploadAvatar from "../UploadAvatar/UploadAvatar"
import { IUser } from "@/constants/interface"

export default function UserModal() {
  const [user, setUser] = useAtom(userState)
  const [, setIsOpenModal] = useAtom(isOpenModalState)
  const [name, setName] = useState<string>(`${user?.username}` || '')
  const [fileUrl, setFileUrl] = useState<string>(`${user?.avatarUrl}` || '')
  const [oldFileUrl, setOldFileUrl] = useState<string>(`${user?.avatarUrl}` || '')

  const onChangeFileUrl = (url: string) => {
    setFileUrl(url)
  }

  const onCancelCreateNewChat =async() => {
    try {
      if(fileUrl !== '') {
        const response = await axios.delete(`${API_SERVER}/bucket/delete/${fileUrl.split("amazonaws.com/")[1]}`)
        if(response) {
          setIsOpenModal(false)
        }
      } else {
        setIsOpenModal(false)
      }
    } catch(e) {
      console.error(e)
    }
  }

  const onDeleteOldFileUrl =async() => {
    try {
      if(fileUrl !== '') {
        const response = await axios.delete(`${API_SERVER}/bucket/delete/${oldFileUrl.split("amazonaws.com/")[1]}`)
        if(response) {
          setIsOpenModal(false)
          setOldFileUrl('')
        }
      } else {
        setIsOpenModal(false)
      }
    } catch(e) {
      console.error(e)
    }
  }

  const onUpdateUser =async() => {
    try {
      const data = {
        avatar_url: fileUrl,
        username: name
      }

      const response = await axios.put(`${API_SERVER}/user/update/${user?.email}`, data)
      if (response) {
        setUser({
          id: response.data.id,
          username: response.data.username,
          avatarUrl: response.data.avatar_url,
          email: response.data.email
        } as IUser)
        console.log('response', response.data)
        onDeleteOldFileUrl()
        setIsOpenModal(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log('user', user)
  }, [user])

  return (
    <div className="w-full h-full flex items-center justify-center text-red-500"
      onClick={onCancelCreateNewChat}
    >
      <div className="w-[500px] h-fit bg-white rounded-lg p-5 flex flex-col"
        onClick={(e) => { e.stopPropagation() }}
      >
        <div className="flex justify-between border-b pb-2">
          <div className="font-bold text-black" >User information</div>
          <div
            className="font-normal text-[#303030] cursor-pointer hover:bg-slate-300 rounded-full"
            onClick={onCancelCreateNewChat}
          > <X /></div>
        </div>

        <div className="w-full h-[80px] mt-2 flex items-center justify-between">
          <div className="w-[70px] h-[70px]">
            <UploadAvatar
              fileUrl={fileUrl}
              onChangeFileUrl={onChangeFileUrl}
            />
          </div>
          <div className="w-[376px]">
            <InputField
              placeholder="User name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </div>
        </div>

        <div className="flex justify-end w-full h-fit ">
          <button
            className="w-[100px] h-[40px] border border-[#BDBDBD] rounded-lg text-[#303030] hover:bg-slate-200 transition-all duration-300"
            onClick={onCancelCreateNewChat}
          >
            cancel
          </button>
          <button className="w-[100px] h-[40px] bg-green-400 rounded-lg ml-2 text-white hover:bg-green-500 transition-all duration-300"
            onClick={onUpdateUser}
          >Update</button>
        </div>

      </div>
    </div>
  )
}