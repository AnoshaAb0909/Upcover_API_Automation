import type { VizQuickQuotePayload } from '../types/quickQuote.payload.types';

export const VIZ_QUICK_QUOTE_OCCUPATION_ID =
  '51a52b8b-6119-4256-93ea-31e795d0b8fe';

export const VIZ_QUICK_QUOTE_DECLARATION_ID =
  '404d4afa-148a-4e9a-b5b6-30adca27ace2';

export const defaultVizQuickQuotePayload: VizQuickQuotePayload = {
  companyRevenue: 2500000,
  occupations: [
    {
      occupationId: VIZ_QUICK_QUOTE_OCCUPATION_ID,
    },
  ],
  declarations: [
    {
      id: VIZ_QUICK_QUOTE_DECLARATION_ID,
      answer: false,
    },
  ],
  state: 'NSW',
  aggregateLimit: 5000000,
  excess: 500,
  isMonthlySubscription: false,
};

export const DEFAULT_VIZ_PHONE_NUMBER = '0475878578';
