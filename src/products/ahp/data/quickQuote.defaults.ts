import type { AhpQuickQuotePayload } from '../types/quickQuote.payload.types';

export const defaultAhpQuickQuotePayload: AhpQuickQuotePayload = {
  occupations: [
    {
      id: '595ab40a-588d-4e0e-8090-347f50cc094e',
      percentage: 100,
    },
  ],
  states: [
    {
      id: 'e5384a75-8180-4d4c-9859-8e84f4ddb36f',
      percentage: 100,
    },
  ],
  averageRevenue: 3433,
  coverInput: [
    {
      coverId: '18abdef3-92af-404a-83f9-fdb451df52a7',
      limits: [
        { name: 'MM-Professional Indemnity', value: 1000000 },
        { name: 'MM-Public & Products Liability', value: 10000000 },
      ],
    },
  ],
};
