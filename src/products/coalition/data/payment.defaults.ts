import { env } from '../../../core/config/env';

export const defaultAnnualPaymentOptions = {
  paymentMethodId: env.fallbackAnnualPaymentMethodId,
};

export const defaultMonthlyPaymentOptions = {
  paymentMethodId: env.fallbackMonthlyPaymentMethodId,
};
