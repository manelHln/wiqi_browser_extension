
import React, { useState } from "react"
import Navigation from "./navigation"
import Navbar from "~components/Navbar"
import CategoryPage from "./category-page"
import NotificationsPage from "./notifications-page"
import Selections from "./selections"
import { Home, Search, Bell } from "lucide-react"

type Props = {}

type PageType = "home" | "category" | "notifications"
type navItem = {
  id: PageType,
  icon: React.ElementType,
  label: string
}

const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "category", icon: Search, label: "Browse" },
    { id: "notifications", icon: Bell, label: "Notifications" },
  ] as const satisfies navItem[]

export default function LoginInvite({}: Props) {
  const [currentPage, setCurrentPage] = useState<PageType>("home")

  return (
    <div className="flex-1 overflow-hidden">
      <Navbar isLoggedIn={false} userEmail={""} setCurrentPage={() => {}} />
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto my-16">
          {currentPage === "home" && <Selections />}
          {currentPage === "category" && <CategoryPage />}
          {currentPage === "notifications" && <NotificationsPage />}
        </div>

        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} navItems={navItems} />
      </div>
    </div>
  )
}
