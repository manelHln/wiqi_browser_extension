import { Toaster } from "react-hot-toast"
import { useEffect, useState } from "react"
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import LoggedIn from "~components/LoggedIn"
import LoginInvite from "~components/LoginInvite"
import { supabase } from "~core/supabase"
import Loader from "~components/loader/Loader"
import Navbar from "~components/Navbar"
import UserProfile from "~components/UserProfile"

import "~styles.css"

function PopupContent() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="w-[380px] h-[600px] flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg">
        <Loader />
      </div>
    )
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <div className="w-[380px] h-[600px]">
            {session ? (
              <>
                <Navbar isLoggedIn={true} userEmail={session.user?.email} />
                <div className="flex-1 overflow-hidden">
                  <LoggedIn user={session.user} />
                </div>
              </>
            ) : (
              <LoginInvite />
            )}
          </div>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <div className="w-[380px] h-[600px]">
            <Navbar isLoggedIn={true} userEmail={session?.user?.email} />
            <UserProfile user={session?.user} />
          </div>
        } 
      />
    </Routes>
  )
}

function IndexPopup() {
  return (
    <MemoryRouter>
      <PopupContent />
      <Toaster position="top-center" reverseOrder={false} />
    </MemoryRouter>
  )
}

export default IndexPopup