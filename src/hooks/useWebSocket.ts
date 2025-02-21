'use client'

import { useEffect, useState } from "react";
import { API_SERVER } from "@/constants/constants";
import { IMessage } from "@/constants/interface";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { currentMessagesState } from "@/jotai/jotai-state";


export const useWebSocket = () => {
  const [messages, setMessages] = useAtom(currentMessagesState)
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const params = useParams();

  const loadMessagesInConversation =async() => {
    try {
      const response = await axios.get(`${API_SERVER}/message/${params.id}`)
      if(setMessages) {
        setMessages(response.data)
      }
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadMessagesInConversation()

    const ws = new WebSocket(`${API_SERVER}/message/ws`);
    
    ws.onopen = () => {
      console.log("OPEN WEBSOCKET CONNECTION!");
    };

    ws.onmessage = (event) => {
      console.log("Receive data:", event.data)
      const parsedData: IMessage = JSON.parse(event.data)
      if(setMessages) {
        setMessages(prev => [...prev, parsedData])
      };
    };

    ws.onclose = () => {
      console.log("CLOSE WEBSOCKET CONNECTION!");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);
  
  const sendMessage = (newMessage: IMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(newMessage));
    } else {
      console.error("WebSocket is not open");
    }
  };

  return {
    messages,
    
    sendMessage
  }
};
