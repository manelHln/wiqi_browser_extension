import CouponApplier from "./couponApplier"
import type { CouponResult } from "./couponApplier"

export default class AmazonCouponApplier extends CouponApplier {
  private readonly couponInputSelector: string = 'input[name="ppw-claimCode"]'
  private readonly applyButtonSelector: string =
    '.pmts-claim-code-apply-button input[type="submit"]'
  private readonly errorMessageSelector: string =
    "#pmts-claim-code-error-messages .pmts-error-message-inline"
  private readonly errorContainerSelector: string = "#pmts-claim-code-error-messages"
  
  // Discount/savings selectors
  private readonly discountSelectors: string[] = [
    '.pmts-summary-preview-single-item-amount.pmts-promotional-discount',
    '[data-feature-name="promotions"] .a-color-price',
    '.pmts-line-item-discount-amount',
    '[class*="promotion"] [class*="amount"]',
    '[class*="discount"] [class*="amount"]'
  ]

  async findCouponInput(): Promise<HTMLInputElement | null> {
    return document.querySelector<HTMLInputElement>(this.couponInputSelector)
  }

  async applyCoupon(code: string): Promise<CouponResult> {
    try {
      // Step 1: Find the input field
      const input = await this.findCouponInput()
      if (!input) {
        throw new Error("Coupon input field not found")
      }

      // Step 2: Clear any existing value and remove error state
      input.value = ""
      input.classList.remove("a-form-error")
      input.focus()

      // Clear any existing error messages
      this.clearErrorMessages()

      // Wait a bit for focus
      await new Promise<void>((resolve) => setTimeout(resolve, 100))

      // Step 3: Set the coupon code
      input.value = code

      // Trigger input events
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.dispatchEvent(new Event("change", { bubbles: true }))
      input.dispatchEvent(new Event("blur", { bubbles: true }))

      // Wait a bit before clicking apply
      await new Promise<void>((resolve) => setTimeout(resolve, 300))

      // Step 4: Find and click the Apply button
      const applyButton = document.querySelector<HTMLInputElement>(
        this.applyButtonSelector
      )
      if (!applyButton) {
        throw new Error("Apply button not found")
      }

      applyButton.click()

      // Step 5: Wait for the response (success or error)
      // Amazon can take a bit to process, so wait longer
      // [ ] todo: Might need to change this and check for response based on a DOM element  
      await new Promise<void>((resolve) => setTimeout(resolve, 3000))

      // Step 6: Check for success or error
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

  private clearErrorMessages(): void {
    const errorContainer = document.querySelector<HTMLElement>(
      this.errorContainerSelector
    )
    if (errorContainer) {
      const errorDivs = errorContainer.querySelectorAll<HTMLElement>(
        ".pmts-error-message-inline"
      )
      errorDivs.forEach((div) => {
        div.classList.add("a-hidden", "aok-hidden")
      })
    }
  }

  private async checkCouponResult(): Promise<CouponResult> {
    // Check for error message first
    const errorElement = document.querySelector<HTMLElement>(
      this.errorMessageSelector
    )
    
    if (errorElement && !errorElement.classList.contains("a-hidden") && !errorElement.classList.contains("aok-hidden")) {
      const errorText = errorElement.querySelector(".a-alert-content p")?.textContent?.trim()
      
      if (errorText) {
        return {
          success: false,
          message: errorText
        }
      }
    }

    // Check if input has error class
    const input = await this.findCouponInput()
    if (input && input.classList.contains("a-form-error")) {
      return {
        success: false,
        message: "The promotional code you entered is not valid."
      }
    }

    // Check for discount amount (success indicator)
    const discount = await this.getDiscountAmount()
    
    if (discount) {
      return {
        success: true,
        message: "Coupon applied successfully!",
        discount
      }
    }

    // If the input is cleared or shows success (no error class and no value)
    // Amazon sometimes clears the input on successful application
    if (input && !input.value && !input.classList.contains("a-form-error")) {
      const possibleDiscount = await this.getDiscountAmount()
      if (possibleDiscount) {
        return {
          success: true,
          message: "Coupon applied successfully!",
          discount: possibleDiscount
        }
      }
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 1500))
    
    const finalDiscount = await this.getDiscountAmount()
    if (finalDiscount) {
      return {
        success: true,
        message: "Coupon applied successfully!",
        discount: finalDiscount
      }
    }

    // Default to error if we can't determine
    return {
      success: false,
      message: "Could not verify coupon status. The code may be invalid."
    }
  }

  async getDiscountAmount(): Promise<string | null> {
    for (const selector of this.discountSelectors) {
      const elements = document.querySelectorAll<HTMLElement>(selector)
      
      for (const element of elements) {
        const text = element.textContent?.trim() || ""
        
        // Look for negative amounts, percentages, or "off" text
        if (text.includes("-") || text.includes("%") || text.toLowerCase().includes("off")) {
          // Make sure it contains a number
          if (/\d/.test(text)) {
            return text
          }
        }
      }
    }

    // Try to find any element with "promotion" or "discount" in the text
    const promotionElements = document.querySelectorAll<HTMLElement>(
      '[class*="promotion"], [class*="discount"], [class*="savings"]'
    )
    
    for (const element of promotionElements) {
      const text = element.textContent?.trim() || ""
      
      // Look for dollar amounts or percentages
      const match = text.match(/-?\$\d+\.?\d*|\d+\.?\d*%/)
      if (match) {
        return match[0]
      }
    }

    return null
  }

  async removeCoupon(): Promise<boolean> {
    try {
      const removeButton = document.querySelector<HTMLElement>(
        'a[href*="removePromotionCode"], button[name*="removePromotionCode"], ' +
        '[class*="remove-promotion"], [class*="remove-code"]'
      )
      
      if (removeButton) {
        removeButton.click()
        await new Promise<void>((resolve) => setTimeout(resolve, 1500))
        return true
      }

      const input = await this.findCouponInput()
      if (input) {
        const currentValue = input.value
        
        if (currentValue) {
          input.value = ""
          input.classList.remove("a-form-error")
          
          input.dispatchEvent(new Event("input", { bubbles: true }))
          input.dispatchEvent(new Event("change", { bubbles: true }))
          
          const applyButton = document.querySelector<HTMLInputElement>(
            this.applyButtonSelector
          )
          if (applyButton) {
            applyButton.click()
            await new Promise<void>((resolve) => setTimeout(resolve, 1500))
          }
          
          return true
        }
      }

      // If no removal method worked, try refreshing the promo section
      // by triggering a form update
      const form = document.querySelector<HTMLFormElement>(
        'form[name*="payment"], form[action*="/gp/buy/"]'
      )
      if (form) {
        const event = new Event("change", { bubbles: true })
        form.dispatchEvent(event)
        await new Promise<void>((resolve) => setTimeout(resolve, 1000))
        return true
      }

      console.warn("Could not find a way to remove coupon")
      return false
      
    } catch (error) {
      console.error("Error removing coupon:", error)
      return false
    }
  }
}