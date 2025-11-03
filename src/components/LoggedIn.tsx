import React, { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Globe, Settings, Tag } from 'lucide-react'
import CouponsTab from './CouponsTab'
import FollowingsTab from './FollowingsTab'
import SettingsTab from './SettingsTab'

type Props = {
  user: User
}

type Tab = 'coupons' | 'following' | 'settings'

export default function LoggedIn({ user }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('coupons')

  return (
    <div className="flex flex-col h-full">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto my-16">
        {activeTab === 'coupons' && <CouponsTab user={user} />}
        {activeTab === 'following' && <FollowingsTab user={user} />}
        {activeTab === 'settings' && <SettingsTab user={user} />}
      </div>

      {/* Bottom Tab Navigation */}
      <div className="border-t border-gray-200 bg-white fixed w-full bottom-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${
              activeTab === 'coupons'
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}>
            <Tag className="w-5 h-5" />
            <span className="text-xs font-medium">Coupons</span>
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${
              activeTab === 'following'
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}>
            <Globe className="w-5 h-5" />
            <span className="text-xs font-medium">Suivis</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${
              activeTab === 'settings'
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}>
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">Paramètres</span>
          </button>
        </div>
      </div>
    </div>
  )
}