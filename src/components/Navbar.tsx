import shoppingBag from "data-base64:../../assets/shopping-bag.png"
import React, { useEffect, useState } from "react"
import type { PageType } from "./LoggedIn"

import { signOut as handleLogout, supabase } from "~core/supabase"

import { Button } from "./ui/button"

type Props = {
  isLoggedIn?: boolean
  userEmail?: string
  setCurrentPage?: (page: PageType) => void
}

export default function Navbar({
  isLoggedIn = false,
  userEmail,
  setCurrentPage
}: Props) {
  const [session, setSession] = useState(null)

  const handleLogin = () => {
    const width = 500
    const height = 650

    const loginUrl = chrome.runtime.getURL("tabs/login.html")

    const left = Math.round((screen.width - width) / 2)
    const top = Math.round((screen.height - height) / 2)

    chrome.windows.create({
      url: loginUrl,
      type: "popup",
      width: width,
      height: height,
      left: left,
      top: top
    })
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const userInitial = session?.user?.email?.charAt(0).toUpperCase() || "U"

  return (
    <div className="flex justify-between w-full fixed top-0 items-center px-4 py-3 bg-white border-b border-gray-200 z-10">
      {/* Logo Section */}
      <div className="flex items-center gap-2">
        <div className="flex items-center shrink-0">
          <img src={shoppingBag} alt="Wiqi Logo" width={26} height={26} />
          <span className="ml-1 font-bold text-2xl text-[#112a5c]">Wi</span>
          <span className="font-bold text-2xl text-[#3da975]">qi</span>
        </div>
      </div>

      {/* User Menu or Login Button */}
      {session ? (
        <Button
          className="rounded-3xl bg-gray-100 hover:bg-gray-200"
          onClick={() => setCurrentPage("profile")}>
          <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
            {userInitial}
          </span>
          <span className="text-secondary">11$</span>
        </Button>
      ) : (
        <Button className="bg-primary text-white" onClick={handleLogin}>Login</Button>
      )}
    </div>
  )
}
