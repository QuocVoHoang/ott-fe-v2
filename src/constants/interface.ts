import { FriendshipStatus, GroupType, MessageType, Navigation } from "./enum";

export interface IUser {
  id: string;
  username: string;
  email: string;
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

export interface IConversation {
  id: string,
  name: string,
  type: GroupType,
  avatar_url: string,
  created_by: string,
  created_at: string,
  updated_at: string,
}

export interface IFriendShip {
  id?: string
  requester_id: string
  receiver_id: string
  status: FriendshipStatus
  created_at?: string,
  updated_at?: string,
}

export interface IFriend extends IFriendShip {
  receiver: IUser
  requester: IUser
}