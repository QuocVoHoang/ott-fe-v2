import { ISidebarItem } from "@/constants/interface";
import { JSX, useEffect, useState } from "react";
import { MessageCircle, SquareUser } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import Tooltip from "@/components/Tooltip/Tooltip";
import { Navigation } from "@/constants/enum";
import { useAtom } from "jotai";
import { isBodyLoadingState } from "@/jotai/jotai-state";

interface Props {
  item: ISidebarItem
  isSidebarOpen: boolean
}

export default function MenuItem({item, isSidebarOpen}: Props) {
  const [icon, setIcon] = useState<JSX.Element|null>(null)
  const t = useTranslations('LeftSidebar')
  const router = useRouter()
  const pathname = usePathname()
  const [, setIsBodyLoading] = useAtom(isBodyLoadingState)

  useEffect(() => {
    switch(item.name) {
      case Navigation.CHAT:
        setIcon(<MessageCircle className={clsx('w-4 h-4', {'w-5 h-5': !isSidebarOpen})}/>)
        break
      case Navigation.CONTACT:
        setIcon(<SquareUser className={clsx('w-4 h-4', {'w-5 h-5': !isSidebarOpen})}/>)
        break
      default:
        break
    }
  }, [item.name, isSidebarOpen])
  
  return(
    <div 
      className={
        clsx(
          {'!text-[#4194d4] bg-[#F2F2F2]': pathname === item.url},
          "w-full h-11 group px-5 flex items-center text-[#494949] cursor-pointer hover:bg-[#F2F2F2] hover:text-[#26a0ff] transition-all duration-200",
      )}
      onClick={() => {
        setIsBodyLoading(true)
        router.push(item.url)
      }}
    >
      <div className={clsx({"mx-2": isSidebarOpen}, {'w-full m-0 flex justify-center': !isSidebarOpen})}>
        {icon}
      </div>
      {isSidebarOpen && t(item.name)}
      {!isSidebarOpen && <Tooltip title={t(item.name)} />}
    </div>
  )
}