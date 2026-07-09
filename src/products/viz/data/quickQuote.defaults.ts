import type { VizQuickQuotePayload } from '../types/quickQuote.payload.types';

export const defaultVizQuickQuotePayload: Omit<
  VizQuickQuotePayload,
  'clientInformation'
> = {
  companyRevenue: 2500000,
  occupations: [
    {
      occupationId: '14cd2375-ddf0-465f-8f90-099b72388189',
      secondDeclaration: false,
    },
  ],
  state: 'NSW',
  aggregateLimit: 5000000,
  excess: 500,
  partnerId: 'upcover',
};

export const DEFAULT_VIZ_PHONE_NUMBER = '0475878578';
