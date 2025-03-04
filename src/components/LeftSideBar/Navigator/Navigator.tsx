"use client"

import { ISidebarMenu } from "@/constants/interface"
import NavigatorItem from "./NavigatorItem/NavigatorItem"
import { LogOut } from "lucide-react"
import Avatar from "@/components/Avatar/Avatar"
import { useSignout } from "@/hooks/useSignout"
import { useEffect, useRef, useState } from "react"
import UserPanel from "@/components/UserPanel/UserPanel"
import { navigationState, userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"
import clsx from "clsx"

interface Props {
  item: ISidebarMenu
  sidebarOpen: boolean
}

export default function Navigator({item, sidebarOpen}:Props) {
  const {
    onSignoutHandler
  } = useSignout()
  const [showPanel, setShowPanel] = useState<boolean>(false)
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [user,] = useAtom(userState)
  const [navigation, setNavigation] = useAtom(navigationState)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPanel]);

  return(
    <div className="w-sidebar-close-no-padding h-full bg-[#6E00FF] rounded-[25px] flex flex-col justify-between items-center">
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-[50px] h-[50px] mt-5 flex items-center justify-center cursor-pointer"
          onClick={() => setShowPanel(prev => !prev)}
          ref={buttonRef}
        >
          <Avatar avatar_url={`${user?.avatarUrl}`} name={`${user?.username}`}/>
        </div>

        {showPanel && 
          <div 
            className="absolute left-[90px] top-[20px]"
            ref={panelRef}
          >
            <UserPanel />
          </div>
        }

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