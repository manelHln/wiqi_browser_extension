import type { User } from "@supabase/supabase-js"
import {
  Bell,
  Home,
  Search,
  ShoppingCart,
  User as UserIcon
} from "lucide-react"
import React, { useState } from "react"

import Navbar from "~components/Navbar"

import CategoryPage from "./category-page"
import EarningsPage from "./earnings-page"
import HomePage from "./home-page"
import Navigation from "./navigation"
import NotificationsPage from "./notifications-page"
import ProfilePage from "./profile-page"

type Props = {
  user: User
}

type navItem = {
  id: PageType
  icon: React.ElementType
  label: string
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "category", icon: Search, label: "Browse" },
  { id: "earnings", icon: ShoppingCart, label: "Earnings" },
  { id: "notifications", icon: Bell, label: "Notifications" }
] as const satisfies navItem[]

export type PageType =
  | "home"
  | "category"
  | "earnings"
  | "notifications"
  | "profile"

export default function LoggedIn({ user }: Props) {
  const [currentPage, setCurrentPage] = useState<PageType>("home")

  return (
    <div className="flex-1 overflow-hidden">
      <Navbar
        isLoggedIn={true}
        userEmail={user?.email}
        setCurrentPage={setCurrentPage}
      />
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto my-16">
          {currentPage === "home" && <HomePage />}
          {currentPage === "category" && <CategoryPage />}
          {currentPage === "earnings" && <EarningsPage />}
          {currentPage === "notifications" && <NotificationsPage />}
          {currentPage === "profile" && <ProfilePage user={user} />}
        </div>

        {/* Bottom Tab Navigation */}
        <Navigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          navItems={navItems}
        />
      </div>
    </div>
  )
}
