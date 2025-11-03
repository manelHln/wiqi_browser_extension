import React, { useState, useEffect } from 'react'
import { Bell, Globe, TrendingUp, ExternalLink, Trash2, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { supabase } from '~core/supabase'
import type { User } from '@supabase/supabase-js'

type FollowedWebsite = {
  id: string
  website_name: string
  website_url: string
  website_favicon: string | null
  coupon_count_last_search: number
  last_searched_at: string | null
  is_active: boolean
}

type Props = {
  user: User
}

export default function FollowingsTab({ user }: Props) {
  const [websites, setWebsites] = useState<FollowedWebsite[]>([])
  const [totalSavings, setTotalSavings] = useState(0)
  const [monthlySavings, setMonthlySavings] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      // Get followed websites
      const { data: websitesData, error: websitesError } = await supabase
        .from('followed_websites')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (websitesError) throw websitesError

      // Get user's total savings
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_savings')
        .eq('id', user.id)
        .single()

      if (userError) throw userError

      // Get current month savings
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: monthlyData, error: monthlyError } = await supabase
        .from('coupon_usage_events')
        .select('discount_amount')
        .eq('user_id', user.id)
        .eq('was_successful', true)
        .gte('used_at', startOfMonth.toISOString())

      if (!monthlyError && monthlyData) {
        const monthTotal = monthlyData.reduce((sum, item) => sum + (item.discount_amount || 0), 0)
        setMonthlySavings(monthTotal)
      }

      setWebsites(websitesData || [])
      setTotalSavings(userData?.total_savings || 0)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWebsite = async (websiteId: string) => {
    try {
      const { error } = await supabase
        .from('followed_websites')
        .update({ is_active: false })
        .eq('id', websiteId)
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state
      setWebsites(websites.filter(w => w.id !== websiteId))
    } catch (error) {
      console.error('Error deleting website:', error)
    }
  }

  const handleVisitWebsite = (url: string) => {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`
    window.open(formattedUrl, '_blank')
  }

  const getRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Jamais vérifié'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
    if (diffHours > 0) return `Il y a ${diffHours}h`
    return 'À l\'instant'
  }

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Stats Card */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-purple-100 text-xs font-medium mb-1">Économies totales</p>
            <h2 className="text-3xl font-bold">€{totalSavings.toFixed(2)}</h2>
          </div>
          <div className="bg-white/20 rounded-lg p-2">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-medium">
            +€{monthlySavings.toFixed(2)} ce mois-ci
          </div>
        </div>
      </div>

      {/* Following List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Sites suivis</h3>
          <span className="text-xs text-gray-500">{websites.length} sites</span>
        </div>

        {websites.length > 0 ? (
          <div className="space-y-2">
            {websites.map((site) => (
              <div
                key={site.id}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-purple-200 hover:shadow-sm transition-all duration-200 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      {site.website_favicon || '🌐'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {site.website_name}
                        </h4>
                        {site.coupon_count_last_search > 0 && (
                          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            {site.coupon_count_last_search} code{site.coupon_count_last_search > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{site.website_url}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {getRelativeTime(site.last_searched_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleVisitWebsite(site.website_url)}
                      className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                      title="Visiter le site">
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    </button>
                    <button 
                      onClick={() => handleDeleteWebsite(site.id)}
                      className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                      title="Ne plus suivre">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              Aucun site suivi
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              Commencez à suivre vos sites préférés pour économiser
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-4">
        <button className="w-full flex items-center justify-center gap-2 text-purple-600 hover:bg-purple-50 py-2.5 rounded-lg transition-colors text-sm font-medium">
          <Bell className="w-4 h-4" />
          Gérer les notifications
        </button>
      </div>
    </div>
  )
}