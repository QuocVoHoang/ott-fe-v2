import { isSidebarOpenState } from "@/jotai/jotai-state";
import clsx from "clsx";
import { useAtom } from "jotai";
import { ChevronRight, SidebarClose } from "lucide-react";
import DropdownMenu from "../DropdownMenu/DropdownMenu";
import { SIDEBAR_MENU } from "@/constants/constants";
import { useTranslations } from "next-intl";

export default function LeftSideBar() {
  const [sidebarOpen, setSidebarOpen] = useAtom(isSidebarOpenState)
  const t = useTranslations('LeftSidebar')
  
  return(
    <div 
      className={clsx({'w-sidebar-open': sidebarOpen, 'w-sidebar-close': SidebarClose},
      'h-screen relative transition-all duration-300 ease-in-out bg-sidebarColor flex flex-col')}
    >
      <div className="h-navbar-height flex items-center justify-center">
        {sidebarOpen ? 'CHAT APP' : 'C'}
      </div>

      <div 
        className={clsx({'w-sidebar-open': sidebarOpen, 'w-sidebar-close': SidebarClose},
        "w-full h-sidebar-body-height overflow-auto transition-all duration-300 ease-in-out")}
      >
        {SIDEBAR_MENU.map((menu, index) => 
          <DropdownMenu menu={menu} key={index} isSidebarOpen={sidebarOpen}/>
        )}
      </div>

      <button 
        className="h-[50px] border bg-[white] hover:bg-[#9bc4fa] duration-300 flex items-center justify-center" 
        onClick={() => setSidebarOpen(prev => !prev)}
      > 
        <ChevronRight className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "rotate-180" : "rotate-0"}`}/>
        {sidebarOpen && t('HideTab')}
      </button>
      
    </div>
  )
}