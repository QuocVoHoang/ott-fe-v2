"use client"

import { isOpenModalState, userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import InputField from "../InputField/InputField"
import { useEffect, useState } from "react"
import { GroupType } from "@/constants/enum"
import { Plus, X } from "lucide-react"
import axios from "axios"
import { API_SERVER } from "@/constants/constants"
import { useRouter } from "@/i18n/routing"
import Avatar from "../Avatar/Avatar"
import { IUser } from "@/constants/interface"
import CircularProgress from "../CircularProgress/CircularProgress"

export default function NewChatModal() {
  const [user,] = useAtom(userState)
  const [, setIsOpenModal] = useAtom(isOpenModalState)
  const router = useRouter()
  const [findingParticipant, setFindingParticipant] = useState<string>('')
  const [foundParticipant, setFoundParticipant] = useState<IUser>()
  const [participants, setParticipants] = useState<string[]>([""])
  const [groupName, setGroupName] = useState('')
  const [type, setType] = useState<GroupType>(GroupType.PRIVATE)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('');

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  const onCreateNewChat = async (
  ) => {
    try {
      const filteredParticipants = participants.filter(item => item !== '')
      const inputParticipants = [...filteredParticipants, user?.email]

      const data = {
        name: groupName,
        type: type,
        participants: inputParticipants,
        created_by: `${user?.email}`,
      };
      const response = await axios.post(`${API_SERVER}/conversation/`, data)
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

  useEffect(() => {
    if (participants.length > 1) {
      setType(GroupType.GROUP)
    } else {
      setType(GroupType.PRIVATE)
    }
  }, [participants])

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
      onClick={() => setIsOpenModal(false)}
    >
      <div className="w-[500px] h-fit bg-white rounded-lg p-5 flex flex-col"
        onClick={(e) => { e.stopPropagation() }}
      >
        <div className="flex justify-between border-b pb-2">
          <div className="font-bold text-black" >Creat Group</div>
          <div
            className="font-normal text-[#303030] cursor-pointer hover:bg-slate-300 rounded-full"
            onClick={() => setIsOpenModal(false)}
          > <X /></div>
        </div>

        <div className="w-full h-[80px] mt-2 flex items-center justify-between">
          <div className="w-[70px] h-[70px]">
            <Avatar
              avatar_url=""
              name="G"
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
          {participants.map((participant, index) => (
            <div key={index}>
              {participant}
            </div>
          ))}
        </div>

        <div className="flex justify-end w-full h-fit ">
          <button
            className="w-[100px] h-[40px] border border-[#BDBDBD] rounded-lg text-[#303030] hover:bg-slate-200 transition-all duration-300"
            onClick={() => setIsOpenModal(false)}
          >
            cancel
          </button>
          <button className="w-[100px] h-[40px] bg-green-400 rounded-lg ml-2 text-white hover:bg-green-500 transition-all duration-300"
            onClick={onCreateNewChat}
          >Create</button>
        </div>

      </div>
    </div>
  )
}