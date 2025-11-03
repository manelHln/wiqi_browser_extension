import type { User } from "@supabase/supabase-js"
import {
  AlertCircle,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  Globe,
  Info,
  Lock,
  Search,
  Shield
} from "lucide-react"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"

import { supabase } from "~core/supabase"

type Coupon = {
  id: string
  code: string
  discount: string
  description: string
  expires_in: string
  verified: boolean
  restrictions: string
}

type Props = {
  user: User
}

const getConfidenceColor = (score: number) => {
  if (score >= 0.9) return "text-green-600"
  if (score >= 0.7) return "text-amber-600"
  return "text-gray-500"
}

export default function CouponsTab({ user }: Props) {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentSite, setCurrentSite] = useState<string>("")
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [searchesRemaining, setSearchesRemaining] = useState<number>(0)
  const [quotaLimit, setQuotaLimit] = useState<number>(0)
  const [canSearch, setCanSearch] = useState<boolean>(true)

  useEffect(() => {
    checkQuota()
    detectCurrentWebsite()
    handleSearchCoupons(true)
  }, [user])

  const detectCurrentWebsite = async () => {
    try {
      // Get current tab URL from Chrome
      if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.url) {
            console.log(tabs[0]?.url)
            setCurrentUrl(tabs[0].url)
            const url = new URL(tabs[0].url)
            setCurrentSite(url.hostname.replace("www.", ""))
          }
        })
      }
    } catch (error) {
      console.error("Error detecting website:", error)
    }
  }

  const checkQuota = async () => {
    try {
      const { data, error } = await supabase.rpc("get_user_quota", {
        p_user_id: user.id
      })

      if (error) throw error

      if (data && data.length > 0) {
        const quota = data[0]
        setQuotaLimit(quota.total_quota)
        setSearchesRemaining(
          quota.total_quota - quota.used_quota + quota.bonus_searches
        )
        setCanSearch(quota.can_search)
      }
    } catch (error) {
      console.error("Error checking quota:", error)
    }
  }

  const handleSearchCoupons = async (fromCache = false) => {
    if (!canSearch) {
      alert(
        "Vous avez atteint votre limite de recherches quotidienne. Passez à Pro pour plus de recherches !"
      )
      return
    }
    if (!currentSite) {
      return
    }

    setLoading(true)

    try {
      // Get current user's access token
      const {
        data: { session }
      } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      if (!accessToken) throw new Error("User not logged in")

      // Call your Edge Function
      const res = await fetch(
        "http://127.0.0.1:54321/functions/v1/search-coupons",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            website_domain: currentSite,
            current_site: currentSite,
            from_cache: fromCache
          })
        }
      )

      const json = await res.json()
      console.log(json)

      if (!res.ok) {
        toast.error(json.error || "Échec de la recherche de coupons")
        return
      }

      setCoupons(json.coupons)
      await checkQuota()
    } catch (error) {
      console.error("Error searching coupons:", error)
      toast.error(error || "Échec de la recherche de coupons")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = async (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)

    try {
      await supabase.from("coupon_usage_events").insert({
        user_id: user.id,
        website_domain: currentSite,
        coupon_code: code,
        was_successful: false, // [ ] todo: Find a way to check this
        discount_amount: null
      })
    } catch (error) {
      console.error("Error tracking coupon copy:", error)
    }
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
              {currentSite}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {searchesRemaining} left
          </span>
        </div>

        {coupons.length === 0 ? (
          <button
            onClick={() => handleSearchCoupons()}
            disabled={loading || !canSearch}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Searching...
              </>
            ) : !canSearch ? (
              <>
                <Lock className="w-4 h-4" />
                Quota Reached
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Codes
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {coupons.length}
              </span>{" "}
              codes found
            </span>
            <button
              onClick={() => handleSearchCoupons()}
              disabled={loading}
              className="text-gray-600 hover:text-gray-900 underline">
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1">
        {/* Quota Warning */}
        {!canSearch && (
          <div className="m-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900 text-xs">
                  Daily limit reached
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Upgrade to Pro for unlimited searches
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Coupons List */}
        <div className="p-3 space-y-2">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
              {/* Main Content */}
              <div className="p-3 space-y-2">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-sm font-bold text-gray-900 uppercase">
                        {coupon.discount}
                      </h3>
                      {coupon.verified && (
                        <Shield className="w-3 h-3 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {coupon.description}
                    </p>
                  </div>
                  {coupon.verified && (
                    <Shield className="w-3 h-3 text-green-600 flex-shrink-0" />
                  )}
                </div>

                {/* Code + Copy Button */}
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 bg-gray-50 border border-dashed border-gray-300 rounded px-2 py-1.5 font-mono text-xs font-semibold text-gray-900 text-center">
                    {coupon.code}
                  </div>
                  <button
                    onClick={() => handleCopyCode(coupon.code, coupon.id)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1 flex-shrink-0 ${
                      copiedId === coupon.id
                        ? "bg-green-600 text-white"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}>
                    {copiedId === coupon.id ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Toggle Details Button */}
                <button
                  onClick={() =>
                    setExpandedId(expandedId === coupon.id ? null : coupon.id)
                  }
                  className="w-full text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 pt-1">
                  <Info className="w-3 h-3" />
                  {expandedId === coupon.id ? "Hide details" : "Show details"}
                </button>
              </div>

              {/* Expandable Details */}
              {expandedId === coupon.id && (
                <div className="px-3 pb-3 pt-0 space-y-1.5 border-t border-gray-100">
                  {coupon.expires_in !== "Unknown" && (
                    <div className="flex items-start gap-1.5 text-xs">
                      <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Expires: {coupon.expires_in}
                      </span>
                    </div>
                  )}

                  {coupon.restrictions && coupon.restrictions !== "None" && (
                    <div className="flex items-start gap-1.5 text-xs">
                      <Info className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        {coupon.restrictions}
                      </span>
                    </div>
                  )}

                  {coupon.description && coupon.description !== "" && (
                    <div className="flex items-start gap-1.5 text-xs">
                      <Info className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        {coupon.description}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Tip */}
        {/* {coupons.length > 0 && ( */}
        <div className="mx-3 mb-3 bg-blue-50 rounded-lg p-2.5 text-center">
          <p className="text-xs text-blue-700">
            💡 AI-powered real-time search
          </p>
        </div>
        {/* )} */}
      </div>
    </div>
  )
}
