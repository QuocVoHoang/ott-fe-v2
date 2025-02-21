import { useSignout } from "@/hooks/useSignout"
import { isSidebarOpenState, userState } from "@/jotai/jotai-state"
import clsx from "clsx"
import { useAtom } from "jotai"
import { LogOut, User } from "lucide-react"
import { JSX, useEffect, useRef, useState } from "react"
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher"
import { useTranslations } from "next-intl"

export default function TopNavBar() {
  const [sidebarOpen, ] = useAtom(isSidebarOpenState)
  const t = useTranslations('TopNavbar')
  const [user, ] = useAtom(userState)
  const [isShowPanel, setIsShowPanel] = useState<boolean>(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  const {
    onSignoutHandler
  } = useSignout()

  const toggleComponent = () => {
    setIsShowPanel((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsShowPanel(false);
      }
    };

    if (isShowPanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShowPanel]);

  return(
    <div 
      className={clsx({'w-nav-sb-open': sidebarOpen, 'w-nav-sb-close': !sidebarOpen},
      `h-navbar-height flex flex-row-reverse box-content bg-sidebarColor transition-all duration-300 ease-in-out`)}
      
    >
      <div className="h-full mr-8 py-2 relative">
        <div className="h-full flex items-center px-4 cursor-pointer hover:bg-[#F2F2F2] rounded-lg"
          ref={buttonRef}
          onClick={toggleComponent}
        >
          <div className="w-8 h-8 border rounded-full flex items-center justify-center mr-2">
            <User />
          </div>
          <div>{user?.email}</div>
        </div>
        {isShowPanel &&
          <div 
            className="absolute top-15 left-2 p-2 h-fit transition-all duration-300 ease-in-out bg-[#cfcbca] shadow-xl rounded-lg z-50" 
            ref={panelRef}
          >
            <PanelItem name={t('profile')} ItemIcon={<User />} />
            <LocaleSwitcher />
            <PanelItem name={t('logout')} ItemIcon={<LogOut />} onHandler={onSignoutHandler}/>
          </div>
        }
      </div>
    </div>
  )
}

interface Props {
  name: string
  ItemIcon: JSX.Element
  onHandler?: () => void
}

const PanelItem =({name, ItemIcon, onHandler}:Props) => {
  return(
    <div className="w-full h-10 flex items-center cursor-pointer hover:bg-[#f2f2f2] p-4 rounded-lg transition-all duration-300 ease-in-out"
      onClick={onHandler}
    >
      <div className="mr-2">
        {ItemIcon}
      </div>
      {name}
    </div>
  )
}