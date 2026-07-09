export type { VizAnnualPaymentPayload } from './payment.payload.types';

export interface VizPaymentResponse {
  id?: string;
  status?: string;
  [key: string]: unknown;
}
