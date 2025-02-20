import { IUser } from '@/constants/interface';
import { atom } from 'jotai';

export const isAuthenticatedState = atom<boolean>(false)

export const userState = atom<null | IUser>(null);

export const isSidebarOpenState = atom<boolean>(true)

export const isPageLoadingState = atom<boolean>(false)

export const isBodyLoadingState = atom<boolean>(false)
