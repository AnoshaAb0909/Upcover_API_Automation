export type { PaymentPayload } from './payment.payload.types';

export interface PaymentResponse {
  id?: string;
  status?: string;
  [key: string]: unknown;
}
