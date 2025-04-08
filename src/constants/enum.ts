export enum Navigation {
  CHAT = 'chat',
  CONTACT = 'contact',
  SETTING = 'setting'
}

export enum ModalType {
  DELETECHAT = 'delete',
  NEWCHAT = 'new',
  UPDATECHAT = 'update',
  UPFILE = 'upfile',
  USER = 'user',
  NEWFRIEND = 'new_friend'
}

export enum MessageType {
  TEXT = 'text', 
  IMAGE = 'image', 
  FILE = 'file', 
  AUDIO = 'audio', 
  VIDEO = 'video'
}

export enum GroupType {
  PRIVATE = 'private',
  GROUP = 'group'
}

export enum FriendshipStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED"
}
