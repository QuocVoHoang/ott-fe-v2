"use client"

import { ISidebarMenu } from "@/constants/interface"
import NavigatorItem from "./NavigatorItem/NavigatorItem"
import { LogOut } from "lucide-react"
import Avatar from "@/components/Avatar/Avatar"
import { useSignout } from "@/hooks/useSignout"
import { isOpenModalState, modalTypeState, navigationState, userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import clsx from "clsx"
import { ModalType } from "@/constants/enum"
import { useRouter } from "@/i18n/routing"

interface Props {
  item: ISidebarMenu
  sidebarOpen: boolean
}

export default function Navigator({item, sidebarOpen}:Props) {
  const {
    onSignoutHandler
  } = useSignout()
  const [user,] = useAtom(userState)
  const [navigation, setNavigation] = useAtom(navigationState)
  const [, setIsOpenModal] = useAtom(isOpenModalState)
  const [, setModalType] = useAtom(modalTypeState)
  const router = useRouter()

  return(
    <div className="w-sidebar-close-no-padding h-full bg-[#6E00FF] rounded-[25px] flex flex-col justify-between items-center">
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-[50px] h-[50px] mt-5 flex items-center justify-center cursor-pointer"
          onClick={() => {
            setIsOpenModal(true)
            setModalType(ModalType.USER)
          }}
        >
          <Avatar avatar_url={`${user?.avatarUrl}`} name={`${user?.username}`}/>
        </div>

        <div className="w-full h-fit mt-5">
          {item.items.map((item, index) => 
            <div 
              key={index} 
              className={clsx(
                {"!bg-[#612DD1] border-r-4 border-r-[#F3B559]": navigation === item.name},
                "w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#612DD1] hover:border-r-4 hover:border-r-[#F3B559]"
              )}
              onClick={() => {
                setNavigation(item.name)
                router.push(`/${item.url}`)
              }}
            >
              <NavigatorItem item={item} sidebarOpen={sidebarOpen} />
            </div>
          )}
        </div>
      </div>
      <div 
        className="w-full flex justify-center items-center py-5 cursor-pointer transition-all duration-300 hover:bg-[#612DD1] hover:rounded-b-[25px]" 
        onClick={onSignoutHandler}>
        <LogOut className='w-7 h-7 text-white'/>
      </div>
    </div>
  )
}