import React, { useState, useEffect } from 'react'
import { User, Crown, Gift, TrendingUp, Calendar, Mail, Shield, Copy, Check, LogOut, ChevronRight, Sparkles, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { signOut, supabase } from '~core/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { Button } from './ui/button'

type Props = {
  user: SupabaseUser
}

type UserStats = {
  total_savings: number
  searches_today: number
  quota_limit: number
  bonus_searches: number
  followed_websites: number
  unread_notifications: number
  subscription_tier: string
  referral_code: string
  referrals_count: number
}

export default function UserProfile({ user }: Props) {
  const navigate = useNavigate()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedReferral, setCopiedReferral] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [user])

  const loadUserData = async () => {
    try {
      const { data: dashboardStats } = await supabase.rpc('get_user_dashboard_stats', {
        p_user_id: user.id
      })
      setStats(dashboardStats)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralCode = () => {
    if (stats?.referral_code) {
      navigator.clipboard.writeText(stats.referral_code)
      setCopiedReferral(true)
      setTimeout(() => setCopiedReferral(false), 2000)
    }
  }

  const handleLogout = async () => {
    signOut()
  }

  const isPremium = stats?.subscription_tier === 'premium' || stats?.subscription_tier === 'pro'

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-white">
      {/* Clean Header */}
      {/* <div className="px-6 pt-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-1">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-sm">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {user.email?.split('@')[0]}
            </h1>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          {isPremium && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-full">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Pro</span>
            </div>
          )}
        </div>
      </div> */}

      {/* Key Stats - Clean Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">€{stats?.total_savings?.toFixed(0) || '0'}</p>
            <p className="text-xs text-gray-500 mt-0.5">Économisé</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              {stats?.searches_today || 0}/{stats?.quota_limit === -1 ? '∞' : stats?.quota_limit}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Recherches</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">{stats?.bonus_searches || 0}</p>
            <p className="text-xs text-gray-500 mt-0.5">Bonus</p>
          </div>
        </div>
      </div>

      {/* Referral Card - Simplified */}
      {stats?.referral_code && (
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="w-5 h-5" />
              <h3 className="font-semibold">Code de parrainage</h3>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 font-mono text-lg font-bold tracking-wide">
                  {stats.referral_code}
                </div>
                <button
                  onClick={copyReferralCode}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
                  {copiedReferral ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="text-2xl font-bold">{stats.referrals_count || 0}</p>
                <p className="text-purple-200 text-xs">Parrainages</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.bonus_searches || 0}</p>
                <p className="text-purple-200 text-xs">Recherches bonus</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Section for Free Users */}
      {!isPremium && (
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="font-semibold">Passer à Pro</h3>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                Recherches illimitées, suivi de prix et alertes
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>50 recherches / jour</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Alertes de prix</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Support prioritaire</span>
                </div>
              </div>

              <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-medium py-2.5 rounded-xl shadow-sm">
                Essayer Pro - 9.99€/mois
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Actions */}
      <div className="px-6 pb-6">
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Modifier le profil</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Historique</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <Shield className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Abonnement</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 capitalize">{stats?.subscription_tier || 'free'}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 pb-8">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Se déconnecter</span>
        </button>
      </div>
    </div>
  )
}