import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import React from "react"
import { useEffect, useState } from "react"
import { signOut as handleLogout } from "~core/supabase"
import { useNavigate } from "react-router-dom"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~components/ui/dropdown-menu"
import { supabase } from "~core/supabase"

type Props = {
  isLoggedIn?: boolean
  userEmail?: string
}

export default function Navbar({ isLoggedIn = false, userEmail }: Props) {
  const [session, setSession] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const userInitial = session?.user?.email?.charAt(0).toUpperCase() || 'U'
  const displayEmail = session?.user?.email || userEmail

  return (
    <div className="flex justify-between w-full fixed top-0 items-center px-4 py-3 bg-white border-b border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-500 rounded-sm flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
          Saveroo
        </h1>
      </div>

      {/* User Menu or Login Button */}
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none focus:outline-none">
            <div className="flex items-center gap-2 hover:bg-gray-50 rounded-sm px-2 py-1.5 transition-colors cursor-pointer group">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-2 ring-white">
                {userInitial}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {displayEmail?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
            </div>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
              <User className="w-4 h-4 mr-2" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none focus:outline-none">
              <User className="w-5 h-5 text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              Se connecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}