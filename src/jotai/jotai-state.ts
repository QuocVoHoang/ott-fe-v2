import { ModalType, Navigation } from '@/constants/enum';
import { IConversation, IUser } from '@/constants/interface';
import { atom } from 'jotai';

export const isAuthenticatedState = atom<boolean>(false)

export const userState = atom<null | IUser>(null);

export const isSidebarOpenState = atom<boolean>(true)

export const isPageLoadingState = atom<boolean>(false)

export const isBodyLoadingState = atom<boolean>(false)

export const isOpenModalState = atom<boolean>(false)
export const modalTypeState = atom<ModalType>(ModalType.NEWCHAT)

export const navigationState = atom<Navigation>(Navigation.CHAT)

export const snackbarState = atom<boolean>(false)
export const snackbarColorState = atom<string>('')
export const snackbarContentState = atom<string>('')

export const conversationsState = atom<IConversation[]>([])

