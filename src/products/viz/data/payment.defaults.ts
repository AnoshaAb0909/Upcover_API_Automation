import { env } from '../../../core/config/env';

export const defaultVizAnnualPaymentOptions = {
  paymentMethodId: env.fallbackAnnualPaymentMethodId,
};

export const defaultVizMonthlyPaymentOptions = {
  paymentMethodId: env.fallbackMonthlyPaymentMethodId,
};
