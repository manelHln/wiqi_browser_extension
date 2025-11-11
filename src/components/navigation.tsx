"use client"
import type { PageType } from "./LoggedIn"

interface NavigationProps {
  currentPage: PageType
  setCurrentPage: React.Dispatch<React.SetStateAction<PageType>>
  navItems?: Array<{ id: PageType; icon: React.ComponentType<any>; label: string }>
}

export default function Navigation({ currentPage, setCurrentPage, navItems }: NavigationProps) {

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentPage(id)}
            className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
              currentPage === id ? "text-primary" : "text-gray-600"
            }`}
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
