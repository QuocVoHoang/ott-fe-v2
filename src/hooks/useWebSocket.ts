'use client'

import { useEffect, useRef, useState } from "react";
import { API_SERVER } from "@/constants/constants";
import { IMessage } from "@/constants/interface";
import axios from "axios";
import { useParams } from "next/navigation";

export const useWebSocket = () => {
  const [messages, setMessages] = useState<IMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  const deleteMessage =async(messageId: string) => {
    try {
      const response = await axios.delete(`${API_SERVER}/message/${messageId}`)
      if(response) {
        setMessages(messages.filter(message => message.id !== messageId))
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
      console.log("WS Receive data:", event.data)
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    messages,
    messagesEndRef,
    sendMessage,
    deleteMessage,
  }
};
