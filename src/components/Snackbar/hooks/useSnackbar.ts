"use client"

import { snackbarColorState, snackbarContentState, snackbarState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"

export default function useSnackbar(){
  const [, setShowSnackbar] = useAtom(snackbarState)
  const [snackbarColor, setSnackbarColor] = useAtom(snackbarColorState)
  const [snackbarContent, setSnackbarContent] = useAtom(snackbarContentState)

  const setShowLeftSnackbar =(show: boolean, color: string, content: string) => {
    setShowSnackbar(show)
    setSnackbarColor(color)
    setSnackbarContent(content)

    setTimeout(() => {
      setShowSnackbar(false)
    }, 3000)
  }

  return {
    snackbarColor: snackbarColor,
    snackbarContent: snackbarContent,

    setShowLeftSnackbar: setShowLeftSnackbar,
    setShowSnackbar: setShowSnackbar,
  }
}