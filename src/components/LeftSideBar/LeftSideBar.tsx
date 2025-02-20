import { isSidebarOpenState } from "@/jotai/jotai-state";
import clsx from "clsx";
import { useAtom } from "jotai";
import { ChevronRight, SidebarClose } from "lucide-react";
import { SIDEBAR_MENU } from "@/constants/constants";
import { useTranslations } from "next-intl";
import Navigator from "./Navigator/Navigator";
import ChatList from "./ChatList/ChatList";
import SearchComponent from "./SearchComponent/SearchComponent";
import NewChatButton from "./NewChatButton/NewChatButton";
import { useState } from "react";
import { useConversation } from "@/hooks/useConversation";

export default function LeftSideBar() {
  const [sidebarOpen, setSidebarOpen] = useAtom(isSidebarOpenState)
  const t = useTranslations('LeftSidebar')
  const [query, setQuery] = useState<string>("")
  
  const {
    conversations,
  } = useConversation()

  // const filteredConversations = conversations?.filter((item) =>
  //   item.name.toLowerCase().includes(query.toLowerCase())
  // )
  
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
        "w-full h-sidebar-body-height transition-all duration-300 ease-in-out overflow-hidden flex")}
      >
        {SIDEBAR_MENU.map((menu, index) => 
          <Navigator key={index} item={menu} sidebarOpen={sidebarOpen}/>
        )}

        {
          sidebarOpen &&
          <div className="flex flex-col w-chatlist h-full">
            <SearchComponent query={query} setQuery={setQuery}/>
            <ChatList conversations={conversations}/>
            <NewChatButton />
          </div>
        }
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