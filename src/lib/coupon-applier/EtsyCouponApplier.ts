import CouponApplier from "./couponApplier"
import type { CouponResult } from "./couponApplier"

export default class EtsyCouponApplier extends CouponApplier {
  private readonly couponToggleSelector: string =
    '[data-selector="strategic-discount-toggle"]'
  private readonly couponInputSelector: string = "#strategic-discount"
  private readonly applyButtonSelector: string =
    '[data-selector="strategic-discount-submit"]'
  private readonly errorMessageSelector: string =
    '[data-selector="strategic-discount-error"]'
  private readonly successOverlaySelector: string = "#nbo-celebration-overlay"
  private readonly couponContainerSelector: string

  constructor(cartId?: string) {
    super()
    // [ ] todo Handle dynamic cart IDs if needed
    this.couponContainerSelector = cartId
      ? `#strategic-discount-input-${cartId}`
      : '[id^="strategic-discount-input-"]'
  }

  async findCouponInput(): Promise<HTMLInputElement | null> {
    return document.querySelector<HTMLInputElement>(this.couponInputSelector)
  }

  private async openCouponField(): Promise<boolean> {
    const toggleButton = document.querySelector<HTMLButtonElement>(
      this.couponToggleSelector
    )
    const container = document.querySelector<HTMLElement>(
      this.couponContainerSelector
    )

    if (!toggleButton) {
      throw new Error("Coupon toggle button not found")
    }

    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true"

    if (!isExpanded) {
      toggleButton.click()

      // Wait for the field to expand
      await new Promise<void>((resolve) => setTimeout(resolve, 300))

      // Verify it opened
      const nowExpanded = toggleButton.getAttribute("aria-expanded") === "true"
      if (!nowExpanded) {
        throw new Error("Failed to open coupon field")
      }
    }

    return true
  }

  async applyCoupon(code: string): Promise<CouponResult> {
    try {
      // Step 1: Open the coupon field if not already open
      await this.openCouponField()

      // Step 2: Find the input field
      const input = await this.findCouponInput()
      if (!input) {
        throw new Error("Coupon input field not found")
      }

      // Step 3: Clear any existing value
      input.value = ""
      input.focus()

      // Wait a bit for focus
      await new Promise<void>((resolve) => setTimeout(resolve, 100))

      // Step 4: Set the coupon code
      input.value = code

      // Trigger input events
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.dispatchEvent(new Event("change", { bubbles: true }))

      // Wait a bit before clicking apply
      await new Promise<void>((resolve) => setTimeout(resolve, 200))

      // Step 5: Find and click the Apply button
      const applyButton = document.querySelector<HTMLButtonElement>(
        this.applyButtonSelector
      )
      if (!applyButton) {
        throw new Error("Apply button not found")
      }

      applyButton.click()

      // Step 6: Wait for the response (success or error)
      await new Promise<void>((resolve) => setTimeout(resolve, 2000))

      // Step 7: Check for success or error
      const result = await this.checkCouponResult()

      return result
    } catch (error) {
      console.error("Error applying coupon:", error)
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred"
      }
    }
  }

  private async checkCouponResult(): Promise<CouponResult> {
    // Check for success overlay
    const successOverlay = document.querySelector<HTMLElement>(
      this.successOverlaySelector
    )
    if (
      successOverlay &&
      successOverlay.getAttribute("aria-hidden") === "false"
    ) {
      return {
        success: true,
        message: "Coupon applied successfully!",
        discount: await this.getDiscountAmount()
      }
    }

    // Check for error message
    const errorMessage = document.querySelector<HTMLElement>(
      this.errorMessageSelector
    )
    if (errorMessage && errorMessage.textContent?.trim()) {
      // Check if the validation message is visible (Etsy shows it when there's an error)
      const input = document.querySelector<HTMLInputElement>(
        this.couponInputSelector
      )
      const hasError = input && input.getAttribute("aria-invalid") === "true"

      if (hasError) {
        return {
          success: false,
          message: errorMessage.textContent.trim()
        }
      }
    }

    // If neither success nor error is clear, check for discount in cart
    const discount = await this.getDiscountAmount()
    if (discount) {
      return {
        success: true,
        message: "Discount applied",
        discount
      }
    }

    // Default to error if we can't determine
    return {
      success: false,
      message: "Could not verify coupon status"
    }
  }

  async getDiscountAmount(): Promise<string | null> {
    const discountSelectors: string[] = [
      '[data-selector="cart-discount-amount"]',
      ".cart-discount-amount",
      '[class*="discount"]',
      '[class*="savings"]'
    ]

    for (const selector of discountSelectors) {
      const elements = document.querySelectorAll<HTMLElement>(selector)
      for (const element of elements) {
        const text = element.textContent?.trim() || ""
        // Look for negative amounts or percentages
        if (text.includes("-") || text.includes("%")) {
          return text
        }
      }
    }

    return null
  }

  async removeCoupon(): Promise<boolean> {
    // Etsy typically has a remove/clear button for applied coupons
    const removeButton = document.querySelector<HTMLButtonElement>(
      '[data-selector="strategic-discount-remove"]'
    )
    if (removeButton) {
      removeButton.click()
      await new Promise<void>((resolve) => setTimeout(resolve, 1000))
      return true
    }

    // Alternative: Clear the input and apply empty
    const input = await this.findCouponInput()
    if (input) {
      input.value = ""
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.dispatchEvent(new Event("change", { bubbles: true }))
      return true
    }

    return false
  }
}