type CouponResult = {
  success: boolean;
  message: string;
  discount?: string | null;
}

export default abstract class CouponApplier {
  abstract findCouponInput(): Promise<HTMLInputElement | null>;
  abstract applyCoupon(code: string): Promise<CouponResult>;
  abstract getDiscountAmount(): Promise<string | null>;
  abstract removeCoupon(): Promise<boolean>;
}

export type { CouponResult };
