"use client"

import { Search } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

interface Props {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
}

export default function SearchComponent({
  query, setQuery
}: Props) {
  
  return(
    <div className="h-search-component-height bg-white flex items-center text-[#7C7C7C] border-none rounded-[15px] px-2 shadow-[0px_4px_5px_2px_rgba(121,197,239,0.38)]">
      <Search className="w-5"/>
      <input 
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search chat"
        className="max-w-full h-full outline-none p-2 "
      />
    </div>
  )
}