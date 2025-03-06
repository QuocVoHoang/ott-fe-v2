"use client"

import { X } from "lucide-react"
import useSnackbar from "./hooks/useSnackbar"

export default function Snackbar() {
  const {
    snackbarContent,
    snackbarColor,
    setShowSnackbar
  } = useSnackbar()

  return(
    <div 
      className={`w-fit h-fit flex items-center absolute left-20 bottom-10 z-[999] border border-[#BDBDBD] rounded-lg p-2`}
      style={{ backgroundColor: snackbarColor }}
    >
      <div className="border-r border-[#BDBDBD] px-2">
        {snackbarContent}
      </div>
      <div className="px-2 cursor-pointer rounded-full hover:opacity-40 p-2 transition-all duration-300"
        onClick={() => setShowSnackbar(false)}
      >
        <X />
      </div>
    </div>
  )
}