import { env } from '../../../core/config/env';

export const defaultAnnualPaymentOptions = {
  paymentMethodId: env.coalitionPaymentMethodId,
  couponId: env.coalitionCouponId,
  isCouponApplied: true,
};

export const defaultMonthlyPaymentOptions = {
  paymentMethodId: env.coalitionMonthlyPaymentMethodId,
};
