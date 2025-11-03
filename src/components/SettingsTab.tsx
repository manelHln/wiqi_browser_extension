import React, { useState, useEffect } from 'react'
import { Bell, Globe, Settings, ExternalLink, Star, LogOut } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '~core/supabase'

type UserSettings = {
  notifications_enabled: boolean
  email_notifications: boolean
  price_drop_alerts: boolean
  quota_warning_alerts: boolean
  language: string
  currency: string
  auto_apply_coupons: boolean
}

type UserSubscription = {
  status: string
  current_period_start: string
  plan_id: string
}

type SubscriptionPlan = {
  name: string
  slug: string
}

type Props = {
  user: User
}

export default function SettingsTab({ user }: Props) {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [user])

  const loadUserData = async () => {
    try {
      // Get user settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError
      }

      // Get user subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select(`
          status,
          current_period_start,
          plan_id,
          subscription_plans (
            name,
            slug
          )
        `)
        .eq('user_id', user.id)
        .single()

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError
      }

      setUserSettings(settingsData)
      setSubscription(subscriptionData)
      setPlan(subscriptionData?.subscription_plans as any)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const getMembershipLabel = () => {
    if (!plan) return 'Membre Free'
    return `Membre ${plan.name}`
  }

  const getMembershipDate = () => {
    if (!subscription?.current_period_start) return 'Récent'
    const date = new Date(subscription.current_period_start)
    return `depuis ${date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`
  }

  const getTierColor = () => {
    if (plan?.slug === 'premium') return 'bg-amber-100 text-amber-700'
    if (plan?.slug === 'pro') return 'bg-purple-100 text-purple-700'
    return 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* User Profile Section */}
      <div className="bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {user.email?.split('@')[0]}
            </h3>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className={`px-2.5 py-1 rounded-full font-medium ${getTierColor()}`}>
            {getMembershipLabel()}
          </div>
          <div className="text-gray-500">{getMembershipDate()}</div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Préférences
        </h3>
        
        <SettingItem
          icon={<Bell className="w-5 h-5" />}
          title="Notifications"
          description={userSettings?.notifications_enabled ? "Activées" : "Désactivées"}
        />
        <SettingItem
          icon={<Star className="w-5 h-5" />}
          title="Favoris"
          description="Sites et produits favoris"
        />
        <SettingItem
          icon={<Globe className="w-5 h-5" />}
          title="Langue et région"
          description={`${userSettings?.language === 'fr' ? 'Français' : 'English'} (${userSettings?.currency || 'EUR'})`}
        />
      </div>

      {/* Account Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Compte
        </h3>
        
        <SettingItem
          icon={<Settings className="w-5 h-5" />}
          title="Paramètres du compte"
          description="Modifier vos informations"
        />
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-4 space-y-1">
        <p className="text-xs text-gray-400">Version 1.0.0</p>
        <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
          <a href="#" className="hover:text-purple-600 transition-colors">Aide</a>
          <span>•</span>
          <a href="#" className="hover:text-purple-600 transition-colors">Confidentialité</a>
          <span>•</span>
          <a href="#" className="hover:text-purple-600 transition-colors">Conditions</a>
        </div>
      </div>
    </div>
  )
}

function SettingItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
      <div className="text-gray-400 group-hover:text-purple-600 transition-colors">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  )
}