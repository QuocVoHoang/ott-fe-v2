"use client"

import { Dispatch, SetStateAction } from "react"

interface Props {
  query: string
  setQuery: Dispatch<SetStateAction<string>>
}

export default function SearchComponent({
  query, setQuery
}: Props) {
  
  return(
    <div className="h-search-component-height border-b">
      <input 
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search chat"
        className="w-full h-full outline-none border p-2"
      />
    </div>
  )
}