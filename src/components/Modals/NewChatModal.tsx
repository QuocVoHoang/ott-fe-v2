"use client"

import { isOpenModalState, userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import InputField from "../InputField/InputField"
import { useEffect, useState } from "react"
import { GroupType } from "@/constants/enum"
import { Trash, Plus } from "lucide-react"
import axios from "axios"
import { API_SERVER } from "@/constants/constants"
import { useRouter } from "@/i18n/routing"

export default function NewChatModal() {
  const [user , ] = useAtom(userState)
  const [, setIsOpenModal] = useAtom(isOpenModalState)
  const router = useRouter()

  const [participants, setParticipants] = useState<string[]>([""]);  
  const [groupName, setGroupName] = useState('')
  const [type, setType] = useState<GroupType>(GroupType.PRIVATE)

  const [notFoundUsers, setNotFoundUsers] = useState<string[]>([])

  const addParticipant = () => {
    setParticipants([...participants, ""]);
  }

  const removeInput = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  }

  const handleChange = (index: number, value: string) => {
    const newInputs = [...participants];
    newInputs[index] = value;
    setParticipants(newInputs);
  }

  const checkExistingUser = async (participants: string[]) => {
    const response = await axios.post('/api/users', {
      participants: participants
    })
    return response.data
  }

  const onCreateNewChat = async(  
    name: string, 
    type: string, 
    participants: string[], 
    created_by: string
  ) => {
    const data = {
      name: name,
      type: type,
      participants: participants,
      created_by: created_by,
    };
    
    try {   
      const response = await axios.post(`${API_SERVER}/conversation/`, data)
      if(response) {
        router.push(`/chat/${response.data.conversation.id}`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onCreateNewGroupChat = async() => {
    if(!participants.includes(`${user?.email}`)) {
      setNotFoundUsers([])
      const areEqual = (arr1: string[], arr2: string[]) =>
        arr1.length === arr2.length && new Set(arr1).size === new Set(arr2).size;

      const existingUsers = await checkExistingUser(participants)

      const equal = areEqual(existingUsers, participants)
      
      if(equal) {
        const allParticipants = [...participants, `${user?.email}`]
        onCreateNewChat(groupName, type, allParticipants, `${user?.email}`)
        setIsOpenModal(false)
      } else {
        participants.forEach((participant: string) => {
          if(!existingUsers.includes(participant) ) {
            setNotFoundUsers(prev => [...prev, participant])
          }
        });
      }
    }
  }

  useEffect(() => {
    if(participants.length > 1) {
      setType(GroupType.GROUP)
    } else {
      setType(GroupType.PRIVATE)
    }
  }, [participants])

  return(
    <div className="w-full h-full flex items-center justify-center text-red-500"
      onClick={() => setIsOpenModal(false)}
    >
      <div className="w-fit h-fit bg-white rounded-lg p-5 flex flex-col"
        onClick={(e) => {e.stopPropagation()}}
      >
        <div>CREATE NEW CHAT</div>
        
        <InputField 
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {participants.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            {notFoundUsers.includes(value as string) &&
              <div className="text-red-400" key={Math.floor(Math.random() * 1000)}>
                user not found
              </div>
            }
            {value === user?.email &&
              <div className="text-red-400" key={Math.floor(Math.random() * 1000)}>
                It&apos;s you
              </div>
            }
            <InputField 
              type="text"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`${index + 1}`}
            />
            {index > 0 &&
              <button
                onClick={() => removeInput(index)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash size={16} />
              </button>
            }
          </div>
        ))}

        <button
          onClick={addParticipant}
          className="flex items-center mt-5 gap-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-fit"
        >
          <Plus size={16} />
          Add
        </button>

        <div className="flex justify-end w-full h-fit">
          <button className="w-[100px] bg-red-300 h-[40px]" onClick={() => setIsOpenModal(false)}>cancel</button>
          <button className="w-[100px] bg-blue-300 h-[40px]"
            onClick={onCreateNewGroupChat}
          >Create</button>
        </div>

      </div>
    </div>
  )
}