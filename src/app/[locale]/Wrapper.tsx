'use client'

import LeftSideBar from "@/components/LeftSideBar/LeftSideBar"
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner"
import TopNavBar from "@/components/TopNavBar/TopNavBar"
import { IUser } from "@/constants/interface"
import { usePathname, useRouter } from "@/i18n/routing"
import { isAuthenticatedState, isBodyLoadingState, isPageLoadingState, userState } from "@/jotai/jotai-state"
import axios from "axios"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { API_SERVER } from "@/constants/constants";

export default function AuthWrapper({children}:{children: React.ReactNode}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user , setUser] = useAtom(userState)
  const [isPageLoading, setIsPageLoading] = useAtom(isPageLoadingState)
  const [isBodyLoading, setIsBodyLoading] = useAtom(isBodyLoadingState)
  const [isAuthenticated] = useAtom(isAuthenticatedState)

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_SERVER}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const responsedUser = response.data
        setUser({
          id: responsedUser.id,
          username: responsedUser.username,
          email: responsedUser.email,
          avatarUrl: responsedUser.avatar_url,
        } as IUser)
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

  useEffect(() => {
    console.log('user', user)
  }, [user])

  return(
    <>
      {isPageLoading &&
        <div className="w-screen h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>}
      {!isPageLoading &&
      <div className="w-full h-full flex overflow-hidden">
        {pathname !== '/signin' && pathname !== '/signup' && <LeftSideBar />}
        <div className="flex flex-col">
          {pathname !== '/signin' && pathname !== '/signup' && <TopNavBar />}
            {isBodyLoading && 
              <div className="w-full h-sidebar-body-height flex items-center justify-center">
                <LoadingSpinner />
              </div>
            }
            {!isBodyLoading && <div className="w-full h-sidebar-body-height">
              {children}
            </div>}
        </div>
      </div>
      }
    </>
    
  )
}