'use client'

import { useEffect, useRef, useState } from "react";
import { API_SERVER } from "@/constants/constants";
import { IMessage } from "@/constants/interface";
import axios from "axios";
import { useParams } from "next/navigation";

export const useWebSocket = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const params = useParams();

  const loadMessagesInConversation = async () => {
    try {
      const response = await axios.get(`${API_SERVER}/message/${params.id}`);
      setMessages(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const deleteRequest = {
        action: "delete",
        message_id: messageId,
      };
      socket.send(JSON.stringify(deleteRequest));
    } else {
      console.error("WebSocket is not open");
    }
  };

  useEffect(() => {
    loadMessagesInConversation();
    const ws = new WebSocket(`${API_SERVER}/message/ws`);
    
    ws.onopen = () => {
      console.log("OPEN WEBSOCKET CONNECTION!");
    };

    ws.onmessage = (event) => {
      console.log("WS Receive data:", event.data);
      const parsedData = JSON.parse(event.data);

      if (parsedData.action === "send") {
        setMessages((prev) => [...prev, parsedData]);
      } else if (parsedData.action === "delete") {
        setMessages((prev) => prev.filter((msg) => msg.id !== parsedData.message_id));
      }
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
      const messageWithAction = { ...newMessage, action: "send" };
      socket.send(JSON.stringify(messageWithAction));
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
  };
};