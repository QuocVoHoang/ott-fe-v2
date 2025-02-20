import { MessageType, Navigation } from "./enum";

export interface IUser {
  id?: string;
  username?: string;
  email?: string;
  avatarUrl: string;
}

export interface ISidebarItem {
  name: Navigation
  url: string
}

export interface ISidebarMenu {
  title: string
  items: ISidebarItem[]
}

export interface IMessage {
  id?: string
  conversation_id: string
  sender_id: string
  content: string
  type?: MessageType
  file_url?: string
  created_at?: string
  updated_at?: string
}