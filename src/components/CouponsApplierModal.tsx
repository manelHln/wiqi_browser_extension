import { AlertCircle, CheckCircle, Lightbulb, XCircle } from "lucide-react"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"

import CouponApplierFactory from "~lib/coupon-applier/couponApplierFactory"

const AutomaticCouponTesterModal = ({ isOpen, onClose, coupons, siteName }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [bestCoupon, setBestCoupon] = useState(null)
  const [isTesting, setIsTesting] = useState(false)

  const logo = chrome.runtime.getURL("assets/icon.png")

  useEffect(() => {
    if (isOpen && coupons.length > 0 && !isTesting) {
      testCoupons()
    }
  }, [isOpen])

  const parseDiscount = (discountStr) => {
    if (!discountStr) return 0

    // Extract numeric value from strings like "-$10", "10%", "$10 off"
    const match = discountStr.match(/(\d+\.?\d*)/)
    if (match) {
      const value = parseFloat(match[1])
      // If it's a percentage, return as is; if dollar amount, return as negative for comparison
      return discountStr.includes("%") ? value : -value
    }
    return 0
  }

  const testCoupons = async () => {
    setIsTesting(true)
    const results = []

    try {
      const applier = CouponApplierFactory.getApplier(siteName)

      if (!applier) {
        toast.error(
          `Automatic coupon testing is not yet supported for ${siteName}`
        )
        setIsComplete(true)
        setIsTesting(false)
        return
      }

      let currentBest = null

      for (let i = 0; i < coupons.length; i++) {
        setCurrentIndex(i)
        const coupon = coupons[i]

        try {
          // Apply the coupon
          const result = await applier.applyCoupon(coupon.code)

          const testResult = {
            code: coupon.code,
            success: result.success,
            discount: result.discount,
            message: result.message
          }

          results.push(testResult)

          // Track the best coupon
          if (result.success && result.discount) {
            const currentValue = parseDiscount(result.discount)
            const bestValue = currentBest
              ? parseDiscount(currentBest.discount)
              : 0

            if (!currentBest || currentValue > bestValue) {
              currentBest = { code: coupon.code, discount: result.discount }
              setBestCoupon(currentBest)
            }
          }

          if (result.success && i < coupons.length - 1) {
            await applier.removeCoupon()
            await new Promise((resolve) => setTimeout(resolve, 500))
          }
        } catch (error) {
          //   console.error(`Error testing coupon ${coupon.code}:`, error)
          results.push({
            code: coupon.code,
            success: false,
            message: error.message || "Error testing code"
          })
        }
      }

      // If we found a best coupon and it's not currently applied, apply it
      if (
        currentBest &&
        results[results.length - 1].code !== currentBest.code
      ) {
        await applier.applyCoupon(currentBest.code)
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred")
    } finally {
      setIsComplete(true)
      setIsTesting(false)
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setCurrentIndex(0)
    setIsComplete(false)
    setBestCoupon(null)
    setIsTesting(false)
    onClose()
  }

  const progressPercentage =
    coupons.length > 0 ? ((currentIndex + 1) / coupons.length) * 100 : 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="pointer-events-auto"
        style={{
          width: "400px",
          maxWidth: "400px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column"
        }}>
        <div className="shadow-lg border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col">
          <div className="p-0 flex flex-col">
            {/* Header */}
            <div className="relative bg-slate-100 px-2 py-4 border-b border-slate-200 flex-shrink-0">
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors"
                disabled={isTesting && !isComplete}>
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
            </div>

            {/* Content */}
            <div className="p-6">
              {!isComplete ? (
                <>
                  {/* Progress Bar */}
                  <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden mb-6">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3bb1f9] via-[#60a5fa] to-[#40dbd5] transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  {/* Current Code Being Tested */}
                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <div className="text-center">
                      <span className="font-mono text-lg font-bold text-slate-900">
                        {coupons[currentIndex]?.code}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {bestCoupon ? (
                    <>
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-center text-slate-900 mb-2">
                        Best Code Found!
                      </h3>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-4 border-2 border-green-200">
                        <div className="text-center mb-3">
                          <p className="text-xs text-slate-600 mb-1">
                            Applied code:
                          </p>
                          <span className="font-mono text-2xl font-bold text-slate-900">
                            {bestCoupon.code}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-green-600 font-semibold text-lg">
                            Discount: {bestCoupon.discount}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center mb-4">
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

                      <h2 className="text-lg font-bold text-center text-slate-900 mb-2">
                        No Valid Codes Found available at this time.
                      </h2>
                    </>
                  )}

                  <button
                    onClick={handleClose}
                    className="w-full bg-gradient-to-r from-[#3bb1f9] via-[#60a5fa] to-[#40dbd5] hover:from-[#2499e0] hover:via-[#3b8ee8] hover:to-[#2cbab5] text-white text-sm font-medium py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                    Done
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-100 px-2 py-4 flex items-center justify-center gap-2 text-slate-500 border-t border-slate-100 flex-shrink-0">
              <span className="text-sm font-normal">
                {!isComplete
                  ? "Hold tight, Wiqi is testing the coupon codes for you"
                  : "Wiqi — your smart shopping assistant"}
              </span>
              <Lightbulb
                className="w-5 h-5 text-slate-400"
                fill="currentColor"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AutomaticCouponTesterModal
