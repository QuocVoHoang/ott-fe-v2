'use client'

import { useEffect, useState } from "react";
import { API_SERVER } from "@/constants/constants";
import { IMessage } from "@/constants/interface";

const WebSocketComponent = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<IMessage | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${API_SERVER}/message/ws`);
    
    ws.onopen = () => {
      console.log("OPen WebSocket connection!");
    };

    ws.onmessage = (event) => {
      console.log("Receive data:", event.data);
    };

    ws.onclose = () => {
      console.log("Close WebSocket connection!");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const newSentMessage: IMessage = {
        conversation_id: '1111',
        sender_id: '1111',
        content: '1111',
      }
      setMessage(newSentMessage)
      socket.send(JSON.stringify(newSentMessage));
    }
  };

  return (
    <div>
      <button onClick={sendMessage}>Gửi</button>
      <button onClick={() => console.log('message', message?.content)}>print</button>
    </div>
  );
};

export default WebSocketComponent;
