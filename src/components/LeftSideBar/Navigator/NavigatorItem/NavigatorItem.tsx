"use client"

import Tooltip from "@/components/Tooltip/Tooltip";
import { Navigation } from "@/constants/enum";
import { ISidebarItem } from "@/constants/interface";
import { MessageCircle, BookUser } from "lucide-react";
import { useTranslations } from "next-intl";
import { JSX, useEffect, useState } from "react";

interface Props {
  item: ISidebarItem
  sidebarOpen: boolean
}

export default function NavigatorItem({item, sidebarOpen}: Props) {
  const [icon, setIcon] = useState<JSX.Element|null>(null)
  const t = useTranslations('LeftSidebar');

  useEffect(() => {
    switch(item.name) {
      case Navigation.CHAT:
        setIcon(<MessageCircle className='w-7 h-7'/>)
        break
      case Navigation.CONTACT:
        setIcon(<BookUser className='w-7 h-7'/>)
        break
      default:
        break
    }
  }, [item.name])

  return(
    <div className="w-[80%] h-12 mt-2 group flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-gray-400 transition-all duration-300">
      {icon}
      {!sidebarOpen && <Tooltip title={t(item.name)} />}
    </div>
  )
}