"use client"

import Image from "next/image"

export default function Avatar({avatar_url, name}:{avatar_url: string, name: string}) {
  return(
    <div className="w-full h-full rounded-full bg-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all duration-300">
      {avatar_url && avatar_url.startsWith("http") ? (
        <Image 
          src={avatar_url} 
          alt="" 
          width={50}
          height={50}
          quality={85}
          objectFit="cover"
          className="w-full h-full rounded-full"  
        />
      ) : (
        <div className="font-extrabold text-black">
          {name.charAt(0)}
        </div>
      )}
    </div>
  )
}