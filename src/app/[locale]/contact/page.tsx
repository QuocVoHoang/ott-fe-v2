"use client"

import Avatar from '@/components/Avatar/Avatar';
import NewFriendButton from '@/components/LeftSideBar/NewFriendButton/NewFriendButton';
import { API_SERVER } from '@/constants/constants';
import { FriendshipStatus } from '@/constants/enum';
import { IFriend } from '@/constants/interface';
import { userState } from '@/jotai/jotai-state';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

export default function Page() {
  const [user,] = useAtom(userState)
  const [allFriends, setAllFriends] = useState<IFriend[]>([])

  const loadAllFriendList = async () => {
    try {
      if (user) {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_SERVER}/friend/friend-list`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response) {
          setAllFriends(response.data)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onAcceptFriendRequest = async (friendship_id: string, receiver_id: string) => {
    if (receiver_id === user?.id) {
      try {
        if (user) {
          const token = localStorage.getItem('token')
          const response = await axios.put(`${API_SERVER}/friend/accept/${friendship_id}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (response) {
            window.location.reload()
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  const onDeleteFriendRequest = async (friendship_id: string) => {
    try {
      if (user) {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${API_SERVER}/friend/remove/${friendship_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response) {
          window.location.reload()
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadAllFriendList()
  }, [user])

  return (
    <div className='w-full h-full flex flex-col items-start justify-start'>
      <div className='w-full h-friend-height flex flex-col overflow-auto'>
        {allFriends.map((fr, ind) => (
          <FriendComponent
            key={ind}
            friend={fr}
            onAcceptFriendRequest={onAcceptFriendRequest}
            onDeleteFriendRequest={onDeleteFriendRequest}
          />
        ))}
      </div>
      <div className="w-full mt-4 mb-2">
        <NewFriendButton />
      </div>
    </div>
  )
}

interface Props {
  friend: IFriend
  onAcceptFriendRequest: (friendship_id: string, receiver_id: string) => Promise<void>
  onDeleteFriendRequest: (friendship_id: string) => Promise<void>
}

function FriendComponent({ friend, onAcceptFriendRequest, onDeleteFriendRequest }: Props) {
  const [user,] = useAtom(userState)
  return (
    <div className='w-full h-[60px] mb-2 border border-[#BDBDBD] rounded-lg flex flex-row bg-white items-center pl-2 justify-between'>
      <div className='w-[50px] h-[50px] mr-2'>
        <Avatar
          name={user!.id === friend.receiver.id ? friend.requester.username : friend.receiver.username}
          avatar_url={user!.id === friend.receiver.id ? friend.requester.avatar_url! : friend.receiver.avatar_url!}
        />
      </div>
      <div className='w-[200px] font-bold text-lg'>{user!.id === friend.receiver.id ? friend.requester.username : friend.receiver.username}</div>
      <div className='w-[100px]'>{friend.status === FriendshipStatus.PENDING && friend.status}</div>

      {(friend.status === FriendshipStatus.PENDING && user?.id === friend.receiver_id) &&
        <div className='flex flex-row h-full w-[100px]'>
          {friend.status === FriendshipStatus.PENDING ?
            <div className='w-[100px] hover:bg-slate-300 transition-all duration-300 cursor-pointer h-full flex items-center justify-center rounded-lg'
              onClick={() => onAcceptFriendRequest(friend.id!, friend.receiver_id!)}
            >
              accept
            </div> :
            <div className='w-[100px]'>
            </div>
          }
        </div>
      }
      {
        <div className='w-[100px] hover:bg-slate-300 transition-all duration-300 cursor-pointer h-full flex items-center justify-center rounded-lg'
          onClick={() => onDeleteFriendRequest(friend.id!)}
        >
          {"delete"}
        </div>
      }
    </div>
  )
}