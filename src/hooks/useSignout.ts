import { useRouter } from "@/i18n/routing"
import { isAuthenticatedState, isPageLoadingState, userState } from "@/jotai/jotai-state"
import { useAtom } from "jotai"

export const useSignout =() => {
  const router = useRouter()
  const [ , setUser] = useAtom(userState)
  const [ , setIsAuthenticated] = useAtom(isAuthenticatedState)
  const [, setIsPageLoading] = useAtom(isPageLoadingState)

  const onSignoutHandler =() => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('token')
    setIsPageLoading(true)
    router.push('/signin')
  }
  return{
    onSignoutHandler: onSignoutHandler
  }
}