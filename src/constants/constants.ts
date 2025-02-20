import { ISidebarMenu } from "@/constants/interface";
import { Navigation } from "./enum";

export const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER as string

export const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY

export const SIDEBAR_MENU: ISidebarMenu[] = [
  {
    title: 'Monitoring',
    items: [
      {
        name: Navigation.CHAT, 
        url: '/chat'
      },
      {
        name: Navigation.CONTACT, 
        url: '/contact'
      },

    ]
  },
]