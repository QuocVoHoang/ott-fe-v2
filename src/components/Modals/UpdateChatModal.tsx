"use client"

import { isOpenModalState, userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import InputField from "../InputField/InputField"
import { useEffect, useState } from "react"
import { Plus, X } from "lucide-react"
import axios from "axios"
import { API_SERVER } from "@/constants/constants"
import { useRouter } from "@/i18n/routing"
import Avatar from "../Avatar/Avatar"
import { IUser } from "@/constants/interface"
import CircularProgress from "../CircularProgress/CircularProgress"
import UploadAvatar from "../UploadAvatar/UploadAvatar"
import { useParams } from "next/navigation"

export default function UpdateChatModal() {
  const { id: conversationId } = useParams()

  const [user,] = useAtom(userState)
  const [, setIsOpenModal] = useAtom(isOpenModalState)
  const router = useRouter()

  const [findingParticipant, setFindingParticipant] = useState<string>('')
  const [foundParticipant, setFoundParticipant] = useState<IUser>()
  const [participants, setParticipants] = useState<string[]>([""])

  const [groupName, setGroupName] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [fileUrl, setFileUrl] = useState<string>('')

  const onChangeFileUrl = (url: string) => {
    setFileUrl(url)
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getConversationById = async () => {
    try {
      const response = await axios.get(`${API_SERVER}/conversation/${conversationId}`)
      if (response) {
        setGroupName(response.data.conversation.name)
        setFileUrl(response.data.conversation.avatar_url)
        setGroupName(response.data.conversation.type)

        const users: IUser[] = response.data.users
        const emails = users.map(user => user.email);
        setParticipants(emails);
      }
    } catch (e) {
      console.error(e)
    }
  }

  const getUserByEmail = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${API_SERVER}/user/info-email/${findingParticipant}`)
      const user: IUser = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        avatarUrl: response.data.avatar_url
      }
      setFoundParticipant(user)
      return user
    } catch (e) {
      console.error(e)
      setFoundParticipant(undefined)
    } finally {
      setIsLoading(false)
    }
  }

  const onUpdate = async (
  ) => {
    try {
      const filteredParticipants = participants.filter(item => item !== '')
      const data = {
        avatar_url: `${fileUrl}`,
        name: `${groupName}`,
        participants: filteredParticipants
      }
      console.log('data', data)
      console.log('conversationId', conversationId)
      const response = await axios.put(`${API_SERVER}/conversation/update/${conversationId}`, data)
      if (response) {
        setIsOpenModal(false)
        router.push(`/chat/${response.data.conversation.id}`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onAddParticipant = (newParticipant: string) => {
    setParticipants(prev => [...prev, newParticipant])
    setFoundParticipant(undefined)
  }

  const onCancel = async () => {
    try {
      if (fileUrl !== '') {
        console.log(fileUrl.split("amazonaws.com/")[1])
        const response = await axios.delete(`${API_SERVER}/bucket/delete/${fileUrl.split("amazonaws.com/")[1]}`)
        if (response) {
          setIsOpenModal(false)
        }
      } else {
        setIsOpenModal(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getConversationById()
  }, [conversationId])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (findingParticipant === `${user?.email}`) {
      setError(`It's you`)
    } else {
      if (findingParticipant.length > 0 && !participants.includes(findingParticipant)) {
        timeoutId = setTimeout(async () => {
          if (isValidEmail(findingParticipant)) {
            const result = await getUserByEmail();
            if (result) {
              setFoundParticipant(result);
              setError('');
            } else {
              setError('User not found!');
              setFoundParticipant(undefined);
            }
          } else {
            setError('Email invalid!');
            setFoundParticipant(undefined);
          }
        }, 500);
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [findingParticipant]);

  return (
    <div className="w-full h-full flex items-center justify-center text-red-500"
      onClick={onCancel}
    >
      <div className="w-[500px] h-fit bg-white rounded-lg p-5 flex flex-col"
        onClick={(e) => { e.stopPropagation() }}
      >
        <div className="flex justify-between border-b pb-2">
          <div className="font-bold text-black" >Update Group</div>
          <div
            className="font-normal text-[#303030] cursor-pointer hover:bg-slate-300 rounded-full"
            onClick={onCancel}
          > <X /> </div>
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
              placeholder="Input group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        </div>

        <div className="font-bold text-black mt-3" >Add members</div>
        <div className="w-full">
          <InputField
            type="text"
            placeholder="Find member"
            value={findingParticipant}
            onChange={(e) => setFindingParticipant(e.target.value)}
            className="text-black"
          />
        </div>

        {isLoading &&
          <div className="w-full mt-2">
            <CircularProgress />
          </div>
        }

        {foundParticipant &&
          <div className="text-black flex h-[50px] mt-2 justify-between">
            <div className="flex items-center">
              <div className="w-[50px] h-[50px]">
                <Avatar name={foundParticipant.username} avatar_url={foundParticipant.avatarUrl} />
              </div>
              <div className="ml-3 text-xl">
                {foundParticipant.username}
              </div>
            </div>
            <div className="w-fit h-full flex items-center">
              <button className="w-[35px] h-[35px] border border-[#BDBDBD] rounded-full flex items-center justify-center hover:bg-slate-200 transition-all duration-300"
                onClick={() => {
                  onAddParticipant(foundParticipant.email)
                  setFindingParticipant('')
                }}
              >
                <Plus />
              </button>
            </div>
          </div>
        }

        {error &&
          <div className="text-red-400">
            {error}
          </div>
        }

        <div className="text-black mt-2">
          {participants.map((participant, index) => {
            return (
              <div key={index}>
                {participant !== user?.email &&
                  <div className="flex w-[50%] pt-2 pr-5 justify-between items-center">
                    <div>
                      {participant}
                    </div>
                    <div className="cursor-pointer hover:bg-slate-300 rounded-full transition-all duration-300"
                      onClick={() => {
                        setParticipants(prev => prev.filter(email => email !== participant))
                      }}
                    >
                      <X />
                    </div>
                  </div>
                }
              </div>
            )
          })}

          <div className="mt-2 w-full flex justify-end"
            onClick={() => {
              setParticipants(prev => prev.filter(email => email !== `${user?.email}`))
            }}
          >
            <div className="border border-[#BDBDBD] rounded-lg px-2 w-fit cursor-pointer bg-orange-300 hover:bg-orange-400 transition-all duration-300">
              Leave group
            </div>
          </div>
        </div>

        <div className="flex justify-end w-full h-fit mt-2">
          <button
            className="w-[100px] h-[40px] border border-[#BDBDBD] rounded-lg text-[#303030] hover:bg-slate-200 transition-all duration-300"
            onClick={onCancel}
          >
            cancel
          </button>
          <button className="w-[100px] h-[40px] bg-green-400 rounded-lg ml-2 text-white hover:bg-green-500 transition-all duration-300"
            onClick={onUpdate}
          >Update</button>
        </div>

      </div>
    </div>
  )
}