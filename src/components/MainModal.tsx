import * as Accordion from "@radix-ui/react-accordion"
import { Check, Copy, Info, Lightbulb } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"

import { Card, CardContent } from "~components/ui/card"
import { signOut as handleLogout, supabase } from "~core/supabase"
import type { WiqiChromeMessageType } from "~lib/utils"

import CouponApplierFactory from "~lib/coupon-applier/couponApplierFactory"
import AutomaticCouponTesterModal from "./CouponsApplierModal"

interface Coupon {
  id: string
  code: string
  discount: string
  description: string
  expires_in?: string
  verified: boolean
  restrictions: string
  confidence_score: number
  source_url: string
}

export default function WiqiInterface() {
  const [activeTab, setActiveTab] = useState("codes")
  const [isOpen, setIsOpen] = useState(false)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [currentSite, setCurrentSite] = useState<string>("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [session, setSession] = useState(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [canApplyCoupons, setCanApplyCoupons] = useState(false)
  const [openCouponApplierModal, setOpenCouponApplierModal] = useState(false)

  const logo = chrome.runtime.getURL("assets/icon.png")

  // Get current tab domain
  const getCurrentTabDomain = () => {
    chrome.runtime.sendMessage({ type: "GET_TAB_ID" }, function (response) {
      // console.log(response)
      if (response.site) {
        setCurrentSite(response.site)
        setCurrentUrl(response.url)
      }
    })
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch coupons from Supabase
  const fetchCoupons = async (
    site: string,
    url: string,
    fromCache: boolean = true
  ) => {
    if (!session) {
      setError("Please login to search for coupons")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      if (!accessToken) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(
        "https://ztwykibwijdpjunuujmx.supabase.co/functions/v1/search-coupons-v2",
        // "https://ztwykibwijdpjunuujmx.supabase.co/functions/v1/search-coupons",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            website_domain: site,
            website_name: site,
            from_cache: fromCache
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to fetch coupons")
      }

      if (data.success && data.coupons) {
        setCoupons(data.coupons)
        // setCanApplyCoupons(canApplyCoupon(currentSite))
        updateBadgeCount(data.coupons.length)
      } else {
        setCoupons([])
        updateBadgeCount(0)
      }
    } catch (err) {
      console.error("Error fetching coupons:", err)
      setError(err.message || "Failed to load coupons")
      setCoupons([])
      updateBadgeCount(0)
    } finally {
      setLoading(false)
    }
  }

  // Update badge count
  const updateBadgeCount = (count: number) => {
    chrome.runtime.sendMessage<WiqiChromeMessageType>({
      type: "SET_ICON_BADGE_COUNT",
      data: { count }
    })
  }

  useEffect(() => {
    if (session && currentSite) {
      const applier = CouponApplierFactory.getApplier(currentSite)
      if(applier){
        applier.findCouponInput().then(input => {
          setCanApplyCoupons(!!input)
        })
      }
      fetchCoupons(currentSite, currentUrl, true)
    }
  }, [session, currentSite]) // only runs when session or currentSite changes

  // Get current tab domain on mount
  useEffect(() => {
    getCurrentTabDomain()
  }, [])

  useEffect(() => {
    // Listen for messages from background script
    const messageListener = async (
      message: WiqiChromeMessageType,
      sender: any,
      sendResponse: any
    ) => {
      if (message && message.type === "TOGGLE_MODAL") {
        setIsOpen((prev) => !prev)
        sendResponse({ success: true })
      }

      if (message && message.type === "LOGGED_IN") {
        console.log("Received LOGGED_IN event from background")
        const {
          data: { session }
        } = await supabase.auth.getSession()

        if (session) {
          setSession(session)
          setError(null)
        }
      }
      return true
    }

    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  const handleCopyCode = async (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)

    // try {
    //   await supabase.from("coupon_usage_events").insert({
    //     user_id: user.id,
    //     website_domain: currentSite,
    //     coupon_code: code,
    //     was_successful: false, // [ ] todo: Find a way to check this
    //     discount_amount: null
    //   })
    // } catch (error) {
    //   console.error("Error tracking coupon copy:", error)
    // }
  }

  const handleLogin = () => {
    const width = 500
    const height = 650
    const left = Math.round((screen.width - width) / 2)
    const top = Math.round((screen.height - height) / 2)
    chrome.runtime.sendMessage({
      type: "LOGIN",
      data: { width: width, height: height, left: left, top: top }
    })
  }

  const onCloseTesterModal = (): void => {
    setOpenCouponApplierModal(false)
  }

  const onOpenTesterModal = (): void => {
    setOpenCouponApplierModal(true)
  }

  if (!isOpen) return null

  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    { openCouponApplierModal ?
      <AutomaticCouponTesterModal
        isOpen={openCouponApplierModal}
        coupons={coupons}
        siteName={currentSite}
        onClose={onCloseTesterModal}
      /> :
      <div className="fixed inset-0 z-[999999] flex items-start justify-end p-4 pointer-events-none">
        <div
          className="pointer-events-auto"
          style={{
            width: "320px",
            maxWidth: "320px",
            maxHeight: "90vh",
            display: openCouponApplierModal ? "hidden" : "flex",
            flexDirection: "column"
          }}>
          <Card
            className="shadow-lg border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col"
            style={{ maxHeight: "90vh" }}>
            <CardContent
              className="p-0 flex flex-col"
              style={{ maxHeight: "90vh" }}>
              {/* Header avec logo */}
              <div className="relative bg-slate-100 px-2 py-4 border-b border-slate-200 flex-shrink-0">
                <button
                  onClick={handleClose}
                  className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-center justify-center gap-1.5">
                  <img
                    src={logo}
                    alt="wiqi logo"
                    className="w-8 h-8 max-w-8 max-h-8"
                  />
                  <span className="text-4xl font-bold text-white leading-none text-shadow-sm">
                    W
                  </span>
                  <span className="text-4xl font-bold text-cyan-400 leading-none text-shadow-sm">
                    i
                  </span>
                  <span className="text-4xl font-bold text-white leading-none text-shadow-sm">
                    q
                  </span>
                  <span className="text-4xl font-bold text-cyan-400 leading-none text-shadow-sm">
                    i
                  </span>
                </div>
                {session && (
                  <button
                    onClick={handleLogout}
                    className="absolute top-6 left-6 text-slate-500 hover:text-red-500 font-medium text-sm transition-colors">
                    Logout
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="flex bg-white border-b border-slate-200 px-2 flex-shrink-0">
                <button
                  onClick={() => setActiveTab("codes")}
                  className={`flex-1 text-sm p-3 tracking-wider transition-all relative ${
                    activeTab === "codes"
                      ? "text-slate-700"
                      : "text-slate-400 hover:text-slate-600"
                  }`}>
                  CODES
                  {activeTab === "codes" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 p-3 text-sm tracking-wider transition-all relative ${
                    activeTab === "history"
                      ? "text-slate-700"
                      : "text-slate-400 hover:text-slate-600"
                  }`}>
                  HISTORIQUE
                  {activeTab === "history" && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400" />
                  )}
                </button>
              </div>

              {/* Content Area */}
              {activeTab === "codes" && (
                <div className="bg-white p-4 flex-1 overflow-y-auto">
                  {!session ? (
                    <>
                      {/* Lock Icon */}
                      <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 rounded-full border-[3px] border-slate-300 flex items-center justify-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#9CA3AF"
                            strokeWidth="2">
                            <rect
                              x="5"
                              y="11"
                              width="14"
                              height="10"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                      </div>

                      {/* Message */}
                      <h2 className="text-xl font-bold text-center text-slate-900 leading-tight mb-4">
                        Please login to
                        <br /> search for coupons.
                      </h2>

                      {/* Login Button */}
                      <button
                        onClick={handleLogin}
                        className="w-full bg-gradient-to-r from-[#3bb1f9] via-[#60a5fa] to-[#40dbd5] hover:from-[#2499e0] hover:via-[#3b8ee8] hover:to-[#2cbab5] text-white text-sm font-medium py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                        Login / Sign up
                      </button>
                    </>
                  ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-sm text-slate-500">
                        Searching coupons...
                      </p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                      </div>
                      <p className="text-sm text-red-600 text-center">
                        {error}
                      </p>
                      <button
                        onClick={() =>
                          fetchCoupons(currentSite, currentUrl, false)
                        }
                        className="mt-3 text-sm text-cyan-500 hover:text-cyan-600">
                        Try again with ai
                      </button>
                    </div>
                  ) : coupons.length === 0 ? (
                    <>
                      {/* Sad Face Icon */}
                      <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 rounded-full border-[3px] border-slate-300 flex items-center justify-center">
                          <svg
                            width="56"
                            height="56"
                            viewBox="0 0 56 56"
                            fill="none">
                            <circle cx="18" cy="20" r="3" fill="#9CA3AF" />
                            <circle cx="38" cy="20" r="3" fill="#9CA3AF" />
                            <path
                              d="M18 38C18 38 22 34 28 34C34 34 38 38 38 38"
                              stroke="#9CA3AF"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Message */}
                      <h2 className="text-xl font-bold text-center text-slate-900 leading-tight mb-4">
                        No code available
                        <br /> for this shop.
                      </h2>

                      {/* Search Button */}
                      <button
                        onClick={() =>
                          fetchCoupons(currentSite, currentUrl, false)
                        }
                        className="w-full bg-gradient-to-r from-[#3bb1f9] via-[#60a5fa] to-[#40dbd5] hover:from-[#2499e0] hover:via-[#3b8ee8] hover:to-[#2cbab5] text-white text-sm font-medium py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                        Search with ai
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Success Icon with Count */}
                      <div className="flex justify-center mb-2">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center border border-[#3bb1f9]">
                          <span className="text-2xl text-[#3bb1f9]">
                            {coupons.length}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      <h2 className="text-xl text-center text-slate-500 leading-tight mb-4">
                        {coupons.length === 1 ? "code" : "codes"} available
                        <br /> for this shop!
                      </h2>
                      {canApplyCoupons && (
                      <button
                        onClick={() => setOpenCouponApplierModal(true)}
                        className="w-full bg-gradient-to-r from-[#3bb1f9] via-[#60a5fa] to-[#40dbd5] hover:from-[#2499e0] hover:via-[#3b8ee8] hover:to-[#2cbab5] text-white text-sm font-medium py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                        Apply automatically
                      </button>
                    )}

                      {/* Coupons List */}
                      <Accordion.Root type="single" collapsible>
                        <Accordion.Item value="item-1">
                          <Accordion.Trigger className="text-xs pt-2 flex justify-center w-full font-normal text-slate-500 hover:underline">
                            See available codes
                          </Accordion.Trigger>
                          <Accordion.Content>
                            <div className="space-y-3 my-4">
                              {coupons.map((coupon) => (
                                <div key={coupon.id}>
                                  {/* Main Content */}
                                  <div className="space-y-2">
                                    {/* Code + Copy Button */}
                                    <div className="flex items-center gap-1.5">
                                      <div className="flex-1 bg-slate-50 border border-dashed border-slate-300 rounded px-2 py-1.5 font-mono text-xs font-semibold text-slate-900 text-center">
                                        {coupon.code}
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleCopyCode(coupon.code, coupon.id)
                                        }
                                        className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1 flex-shrink-0 ${
                                          copiedId === coupon.id
                                            ? "bg-green-600 text-white"
                                            : "bg-slate-900 text-white hover:bg-slate-800"
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
                                        setExpandedId(
                                          expandedId === coupon.id
                                            ? null
                                            : coupon.id
                                        )
                                      }
                                      className="w-full text-xs text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 pt-1">
                                      <Info className="w-3 h-3" />
                                      {expandedId === coupon.id
                                        ? "Hide details"
                                        : "Show details"}
                                    </button>
                                  </div>

                                  {/* Expandable Details */}
                                  {expandedId === coupon.id && (
                                    <div className="px-3 pb-3 pt-0 space-y-1.5 border-t border-slate-100">
                                      {coupon.restrictions &&
                                        coupon.restrictions !== "None" && (
                                          <div className="flex items-start gap-1.5 text-xs">
                                            <Info className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                              {coupon.restrictions}
                                            </span>
                                          </div>
                                        )}

                                      {coupon.description &&
                                        coupon.description !== "" && (
                                          <div className="flex items-start gap-1.5 text-xs">
                                            <Info className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700">
                                              {coupon.description}
                                            </span>
                                          </div>
                                        )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </Accordion.Content>
                        </Accordion.Item>
                      </Accordion.Root>
                    </>
                  )}
                </div>
              )}
              {activeTab === "history" && (
                <div className="min-h-[200px]">
                  <p>Your history here</p>
                </div>
              )}

              {/* Footer */}
              <div className="bg-slate-100 px-2 py-4 flex items-center justify-center gap-2 text-slate-500 border-t border-slate-100 flex-shrink-0">
                <span className="text-sm font-normal">
                  Wiqi — votre assistant shopping intelligent
                </span>
                <Lightbulb
                  className="w-5 h-5 text-slate-400"
                  fill="currentColor"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
}
    </>
  )
}
