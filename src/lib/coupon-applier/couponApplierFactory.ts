import AmazonCouponApplier from "./AmazonCouponApplier";
import EtsyCouponApplier from "./EtsyCouponApplier";
import CouponApplier from "./couponApplier";

export default class CouponApplierFactory {
  static getApplier(siteName: string, cartId?: string): CouponApplier {
    const site = siteName.toLowerCase();
    
    switch (site) {
      case 'etsy.com':
        return new EtsyCouponApplier();
      case 'amazon.com':
        return new AmazonCouponApplier();
      default:
        throw new Error(`No CouponApplier found for site: ${siteName}`);
    }
  }
}