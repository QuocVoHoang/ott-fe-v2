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
  const conversationId = params.id;

  const loadMessagesInConversation = async () => {
    try {
      const response = await axios.get(`${API_SERVER}/message/${conversationId}`);
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
      console.error("WebSocket chưa mở");
    }
  };

  useEffect(() => {
    loadMessagesInConversation();

    const wsProtocol = API_SERVER.startsWith('https') ? 'wss://' : 'ws://';
    const wsHost = API_SERVER.replace(/^https?:\/\//, '');
    const wsUrl = `${wsProtocol}${wsHost}/message/ws?conversation_id=${conversationId}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("MỞ KẾT NỐI WEBSOCKET!", conversationId);
    };

    ws.onmessage = (event) => {
      console.log("WS Nhận dữ liệu:", event.data);
      const parsedData = JSON.parse(event.data);

      if (parsedData.action === "send") {
        setMessages((prev) => [...prev, parsedData]);
      } else if (parsedData.action === "delete") {
        setMessages((prev) => prev.filter((msg) => msg.id !== parsedData.message_id));
      }
    };

    ws.onclose = () => {
      console.log("ĐÓNG KẾT NỐI WEBSOCKET!");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [conversationId]);

  const sendMessage = (newMessage: IMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const messageWithAction = { ...newMessage, action: "send" };
      socket.send(JSON.stringify(messageWithAction));
    } else {
      console.error("WebSocket chưa mở");
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