"use client"

import { isOpenModalState, userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import InputField from "../InputField/InputField"
import { useEffect, useState } from "react"
import { Plus, X } from "lucide-react"
import axios from "axios"
import { API_SERVER } from "@/constants/constants"
import Avatar from "../Avatar/Avatar"
import { IUser } from "@/constants/interface"
import CircularProgress from "../CircularProgress/CircularProgress"
import useSnackbar from "../Snackbar/hooks/useSnackbar"

export default function NewFriendModal() {
  const [user,] = useAtom(userState)
  const [, setIsOpenModal] = useAtom(isOpenModalState)
  const [findingText, setFindingText] = useState<string>('')
  const [findingFriend, setFindingFriend] = useState<IUser>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const {
    setShowLeftSnackbar
  } = useSnackbar()

  const isValidContact = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+84\d{9}$/; // +84 và theo sau là đúng 9 chữ số
  
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  const getUserByEmail = async () => {
    try {
      setError('')
      setIsLoading(true)
      const response = await axios.get(`${API_SERVER}/user/info-email/${findingText}`)
      const user: IUser = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        avatarUrl: response.data.avatar_url
      }
      setFindingFriend(user)
      return user
    } catch (e) {
      console.error(e)
      setFindingFriend(undefined)
    } finally {
      setIsLoading(false)
    }
  }

  const onAddFriend = async (
  ) => {
    try {
      const token = localStorage.getItem('token')

      const response = await axios.post(`${API_SERVER}/friend/request/`, {
        receiver_id: findingFriend?.id
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if(response) {
        setShowLeftSnackbar(true, "#5afa82", "Sent friend request!")
        setFindingText('')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onCancelCreateNewChat =async() => {
    setIsOpenModal(false)
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (findingText === `${user?.email}`) {
      setError(`Invalid user! (it's your email-phone)`)
    } else {
      if (findingText.length > 0) {
        timeoutId = setTimeout(async () => {
          if (isValidContact(findingText)) {
            const result = await getUserByEmail();
            if (result) {
              setFindingFriend(result);
              setError('');
            } else {
              setError('User not found!');
              setFindingFriend(undefined);
            }
          } else {
            setError('Email invalid!');
            setFindingFriend(undefined);
          }
        }, 500);
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [findingText]);

  return (
    <div className="w-full h-full flex items-center justify-center text-red-500"
      onClick={onCancelCreateNewChat}
    >
      <div className="w-[500px] h-fit bg-white rounded-lg p-5 flex flex-col"
        onClick={(e) => { e.stopPropagation() }}
      >
        <div className="flex justify-between pb-2">
          <div className="font-bold text-black" >Add friend</div>
          <div
            className="font-normal text-[#303030] cursor-pointer hover:bg-slate-300 rounded-full"
            onClick={onCancelCreateNewChat}
          > <X /></div>
        </div>

        <div className="w-full">
          <InputField
            type="text"
            placeholder="Find friend by email - phone"
            value={findingText}
            onChange={(e) => setFindingText(e.target.value)}
            className="text-black"
          />
        </div>

        {isLoading &&
          <div className="w-full mt-2">
            <CircularProgress />
          </div>
        }

        {findingFriend &&
          <div className="text-black flex h-[50px] mt-2 justify-between">
            <div className="flex items-center">
              <div className="w-[50px] h-[50px]">
                <Avatar name={findingFriend.username} avatar_url={findingFriend.avatarUrl} />
              </div>
              <div className="ml-3 text-xl">
                {findingFriend.username}
              </div>
            </div>
            <div className="w-fit h-full flex items-center">
              <button className="w-[35px] h-[35px] border border-[#BDBDBD] rounded-full flex items-center justify-center hover:bg-green-300 transition-all duration-300"
                onClick={onAddFriend}
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

        <div className="flex justify-end w-full h-fit mt-3">
          <button
            className="w-[100px] h-[40px] border border-[#BDBDBD] rounded-lg text-[#303030] hover:bg-slate-200 transition-all duration-300"
            onClick={onCancelCreateNewChat}
          >
            cancel
          </button>
          {/* <button className="w-[100px] h-[40px] bg-green-400 rounded-lg ml-2 text-white hover:bg-green-500 transition-all duration-300"
            onClick={onAddFriend}
          >
            Add
          </button> */}
        </div>

      </div>
    </div>
  )
}