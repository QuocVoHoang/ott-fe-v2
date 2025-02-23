import { IConversation, IMessage, IUser } from '@/constants/interface';
import { atom } from 'jotai';

export const isAuthenticatedState = atom<boolean>(false)

export const userState = atom<null | IUser>(null);

export const isSidebarOpenState = atom<boolean>(true)

export const isPageLoadingState = atom<boolean>(false)

export const isBodyLoadingState = atom<boolean>(false)

export const isOpenNewChatState = atom<boolean>(false)

export const isOpenDeleteChatState = atom<boolean>(false)

export const isOpenProfileState = atom<boolean>(false)

export const currentConversationState = atom<IConversation | null>(null)

export const currentMessagesState = atom<IMessage[]>([])
