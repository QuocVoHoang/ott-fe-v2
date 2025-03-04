import { isSidebarOpenState } from "@/jotai/jotai-state";
import clsx from "clsx";
import { useAtom } from "jotai";
import { SidebarClose } from "lucide-react";
import { SIDEBAR_MENU } from "@/constants/constants";
import Navigator from "./Navigator/Navigator";
import SearchComponent from "./SearchComponent/SearchComponent";
import { useState } from "react";
import ChatList from "./ChatList/ChatList";
import NewChatButton from "./NewChatButton/NewChatButton";


export default function LeftSideBar() {
  const [sidebarOpen, ] = useAtom(isSidebarOpenState)
  const [query, setQuery] = useState<string>("")

  
  return(
    <div 
      className={clsx({'w-sidebar-open-with-padding': sidebarOpen, 'w-sidebar-close-with-padding': SidebarClose},
      'h-screen relative transition-all duration-300 ease-in-out flex flex-col p-5')}
    >
      <div 
        className={clsx({'w-sidebar-open-no-padding': sidebarOpen, 'w-sidebar-close-no-padding': SidebarClose},
        "h-sidebar-body-height transition-all duration-300 ease-in-out overflow-hidden flex"
      )}
      >
        {SIDEBAR_MENU.map((menu, index) => 
          <Navigator key={index} item={menu} sidebarOpen={sidebarOpen}/>
        )}

        <div className="w-sidebar-second-component h-full mx-5 flex flex-col">
          <SearchComponent query={query} setQuery={setQuery}/>
          <div className="w-full h-group-people-height flex flex-col justify-between mt-4 pb-2">
            <ChatList />
          </div>
          <div>
            <NewChatButton />
          </div>
        </div>
      </div>
      
    </div>
  )
}