import { ISidebarMenu } from "@/constants/interface";
import MenuItem from "./MenuItem/MenuItem";
import clsx from "clsx";

interface Props {
  menu: ISidebarMenu
  isSidebarOpen: boolean
}

export default function DropdownMenu({menu, isSidebarOpen}: Props) {
  return(
    <div className={clsx({"!mb-0": !isSidebarOpen}, 'w-full h-fit mb-2 text-xs text-[#828282]')}>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out max-h-screen opacity-100`}
      >
        {menu.items.map((item, index) => 
          <MenuItem key={index} item={item} isSidebarOpen={isSidebarOpen}/>
        )}
      </div>
    </div>
  )
}