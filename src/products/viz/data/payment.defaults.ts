import { env } from '../../../core/config/env';

export const defaultVizAnnualPaymentOptions = {
  paymentMethodId: env.vizPaymentMethodId,
};

export const defaultVizMonthlyPaymentOptions = {
  paymentMethodId: env.vizMonthlyPaymentMethodId,
};
