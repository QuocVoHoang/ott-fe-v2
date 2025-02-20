"use client"

import { ISidebarMenu } from "@/constants/interface"
import NavigatorItem from "./NavigatorItem/NavigatorItem"

interface Props {
  item: ISidebarMenu
  sidebarOpen: boolean
}

export default function Navigator({item, sidebarOpen}:Props) {
  return(
    <div className="w-sidebar-close h-full bg-blue-300 flex flex-col items-center">
      {item.items.map((item, index) => <NavigatorItem key={index} item={item} sidebarOpen={sidebarOpen}/>)}
    </div>
  )
}