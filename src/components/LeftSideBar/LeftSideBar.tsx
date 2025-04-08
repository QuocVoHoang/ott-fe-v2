import { isSidebarOpenState } from "@/jotai/jotai-state";
import clsx from "clsx";
import { useAtom } from "jotai";
import { SidebarClose } from "lucide-react";
import { SIDEBAR_MENU } from "@/constants/constants";
import Navigator from "./Navigator/Navigator";
import SearchComponent from "./SearchComponent/SearchComponent";
import { useState } from "react";
import NewChatButton from "./NewChatButton/NewChatButton";
import GroupChatList from "./GroupChatList/GroupChatList";
import FriendList from "./FriendList/FriendList";
import NewFriendButton from "./NewFriendButton/NewFriendButton";


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
            <div className="w-full h-[49%]">
              <FriendList />
            </div>
            <div className="w-full h-[50%]">
              <GroupChatList />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="w-[49%]">
              <NewChatButton />
            </div>
            <div className="w-[49%]">
              <NewFriendButton />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}