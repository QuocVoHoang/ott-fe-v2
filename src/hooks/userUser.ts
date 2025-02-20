'use client'

import axios from "axios"

export const useUser =() => {
  
  const checkExistingUser = async (participants: string[]) => {
    const response = await axios.post('/api/users', {
      participants: participants
    })
    return response.data
  }

  return {
    checkExistingUser,
  }
}