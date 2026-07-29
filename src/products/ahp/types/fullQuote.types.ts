import type { AhpQuickQuoteResponse } from './quickQuote.types';

export interface AhpMonthlyInstallmentsBreakdown {
  payable: number;
  stripeFee?: number;
  upcoverFee?: number;
  monthlyPremium?: number;
  monthlyPremiumFee?: number;
  monthliesFee?: number;
  monthliesFeeGst?: number;
  clientPayable: number;
  totalPayable?: number;
}

export interface AhpMonthlyPriceBreakdown {
  basePremium?: number;
  gst?: number;
  emergencyServicesLevy?: number;
  stampDuty?: number;
  serviceFee?: number;
  serviceFeeGst?: number;
  clientPayable: number;
  monthliesFee?: number;
  monthliesFeeGst?: number;
  paymentGatewayFee?: number;
  totalPayable?: number;
  monthlyInstallments?: AhpMonthlyInstallmentsBreakdown;
}

export interface AhpFullQuoteResponseBody {
  quote: AhpQuickQuoteResponse;
  monthlyPriceBreakdown?: {
    monthlyPriceBreakdown?: AhpMonthlyPriceBreakdown;
  };
  installmentDates?: string[];
  changes?: unknown[];
}
