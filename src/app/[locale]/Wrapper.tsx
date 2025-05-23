'use client'

import LeftSideBar from "@/components/LeftSideBar/LeftSideBar"
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner"
import { IUser } from "@/constants/interface"
import { usePathname, useRouter } from "@/i18n/routing"
import { 
  isAuthenticatedState, 
  isBodyLoadingState,
  isOpenModalState,
  isPageLoadingState, 
  isSidebarOpenState, 
  navigationState, 
  snackbarState, 
  userState 
} from "@/jotai/jotai-state"
import axios from "axios"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { API_SERVER } from "@/constants/constants";
import Modal from "@/components/Modals/Modal"
import Snackbar from "@/components/Snackbar/Snackbar"
import { Navigation } from "@/constants/enum"

export default function AuthWrapper({children}:{children: React.ReactNode}) {
  const router = useRouter()
  const pathname = usePathname()
  const [ , setUser] = useAtom(userState)
  const [isPageLoading, setIsPageLoading] = useAtom(isPageLoadingState)
  const [isBodyLoading, setIsBodyLoading] = useAtom(isBodyLoadingState)
  const [isOpenModal,] = useAtom(isOpenModalState)
  const [isAuthenticated] = useAtom(isAuthenticatedState)
  const [showSnackbar, ] = useAtom(snackbarState) 
  const [, setSidebarOpen] = useAtom(isSidebarOpenState)
  const [, setNavigation] = useAtom(navigationState)

  useEffect(() => {
    if(pathname === '/contact'){
      setSidebarOpen(false)
      setNavigation(Navigation.CONTACT)
    } else {
      setSidebarOpen(true)
      setNavigation(Navigation.CHAT)
    }
  }, [pathname])

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_SERVER}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const responsedUser = response.data
        const loginUser = {
          id: responsedUser.id,
          username: responsedUser.username,
          email: responsedUser.email,
          avatarUrl: responsedUser.avatar_url,
        } as IUser
        setUser(loginUser)
        if(pathname === '/signin' || pathname === '/signup') {
          setIsPageLoading(true)
          router.push("/")
        }
      } catch (error) {
        console.error(error)
        if(pathname === '/signin' || pathname === '/signup') {}
        else {
          setIsPageLoading(true)
          router.push('/signin')
        }
        localStorage.removeItem('token')
      }
    }

    if(token) {
      fetchUser()
    } else {
      if(pathname === '/signin' || pathname === '/signup') {}
      else {
        setIsPageLoading(true)
        router.push('/signin')
      }
    }

    setIsPageLoading(false)
    setIsBodyLoading(false)
  }, [router, pathname, isAuthenticated, setUser, setIsPageLoading, setIsBodyLoading])

  return(
    <>
      {isOpenModal &&
        <div className="absolute top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
          <Modal />
        </div>
      }
      {isPageLoading &&
        <div className="w-screen h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
      }
      {!isPageLoading && 
      <div className="w-full h-full flex overflow-hidden bg-[#EFF6FC] relative">
        {showSnackbar &&
          <Snackbar />
        }
        {pathname !== '/signin' && pathname !== '/signup' && !pathname.includes('channel') &&
          <LeftSideBar />
        }
        <div className="flex flex-col">
          {isBodyLoading && 
            <div className="w-full h-sidebar-body-height flex items-center justify-center">
              <LoadingSpinner />
            </div>
          }
          {!isBodyLoading && 
            <div className={`w-chat-container h-main-body-height ${pathname.includes('channel') ? 'm-0 p-0' : 'my-5 pr-5'}`}>
              {children}
            </div>
          }
        </div>
      </div>
      }
    </>
  )
}