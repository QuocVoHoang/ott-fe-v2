'use client'

import Avatar from "@/components/Avatar/Avatar";
import { IConversation } from "@/constants/interface"
import { usePathname } from "@/i18n/routing";
import { currentConversationState, isOpenDeleteChatState } from "@/jotai/jotai-state";
import clsx from "clsx";
import { useAtom } from "jotai";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { JSX, useEffect, useRef, useState } from "react";


export default function ChatItem({item}: {item: IConversation}){
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const [isShowPanel, setIsShowPanel] = useState<boolean>(false)
  const [, setIsOpenDeleteChat] = useAtom(isOpenDeleteChatState)
  const [, setCurrentConversation] = useAtom(currentConversationState)
  const [isSelecting, setIsSelecting] = useState<boolean>(false)
  const pathname = usePathname()

  const onOpenDeleteModal =() => {
    setIsShowPanel(false)
    setIsOpenDeleteChat(true)
  }

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

  useEffect(() => {
    setIsSelecting(pathname.includes(`${item.id}`))
  }, [pathname])

  return(
    <div className={clsx(
      {'bg-slate-300': isSelecting},
      "w-full h-[80px] hover:bg-slate-300 cursor-pointer flex items-center justify-between pl-3 transition-all duration-300"
    )}
      onClick={() => setCurrentConversation(item)}
    >
      <div className="flex">
        <div className="w-12 h-12" >
          <Avatar avatar_url={item.avatar_url} name={item.name}/>
        </div>
        <div className="ml-2 flex flex-col">
          <div className="text-lg font-bold">
            {item.name}
          </div>
          <div className="text-gray-400 text-sm font-thin">text</div>
        </div>
      </div>
      <div 
        ref={buttonRef}
        className="mr-2 w-[30px] flex justify-center items-center border-l"
        onClick={(e) => {
          e.stopPropagation()
          toggleComponent()
        }}
      >
        <EllipsisVertical />
      </div>
      {isShowPanel &&
        <div
          ref={panelRef}
          className="absolute top-15 right-[-32%] z-50 p-2 h-fit transition-all duration-300 ease-in-out bg-[#cfcbca] shadow-xl rounded-lg"
        >
          <PanelItem name="Edit" ItemIcon={<Pencil />}/>
          <PanelItem name="Delete" ItemIcon={<Trash2 />} onHandler={onOpenDeleteModal}/>
        </div>
      }
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
    <div className="w-full h-5 flex items-center cursor-pointer hover:bg-[#f2f2f2] p-4 px-2 rounded-lg transition-all duration-300 ease-in-out"
      onClick={onHandler}
    >
      <div className="mr-2">
        {ItemIcon}
      </div>
      {name}
    </div>
  )
}