'use client'

import { API_SERVER } from "@/constants/constants";
import { IConversation } from "@/constants/interface";
import { currentConversationState, userState } from "@/jotai/jotai-state";
import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export const useConversation =() => {
  const [user , ] = useAtom(userState)
  const [currentConversation, setCurrentConversation] = useAtom(currentConversationState)
  const [conversations, setConversations] = useState<IConversation[]>([])

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
      const newConversation = response.data.conversation as IConversation
      setCurrentConversation(newConversation)
    } catch (e) {
      console.error(e)
    }
  }

  const loadAllUserConversations =async() => {
    try {
      const response = await axios.get(`${API_SERVER}/user/${user?.email}/conversations`)
      setConversations(response.data)
    } catch (e) {
      console.error(e)
    }
  }

  const onDeleteGroupChat = async() => {
    try {
      await axios.delete(`${API_SERVER}/conversation/${currentConversation?.name}`)
      setCurrentConversation(null)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if(user !== null) {
      loadAllUserConversations()
    }
  }, [user])

  useEffect(() => {
    loadAllUserConversations()
  }, [currentConversation]);  

  return {
    conversations, 

    onCreateNewChat,
    onDeleteGroupChat
  }
}
