import { env } from '../../../core/config/env';

export const defaultAhpAnnualPaymentOptions = {
  paymentMethodId: env.fallbackAnnualPaymentMethodId,
};

export const defaultAhpMonthlyPaymentOptions = {
  paymentMethodId: env.fallbackMonthlyPaymentMethodId,
};
