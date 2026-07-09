import type { VizFullQuotePayload } from '../types/fullQuote.payload.types';

export const defaultVizCompanyAddress: VizFullQuotePayload['companyAddress'] = {
  street: '452 Flinders Street, Melbourne VIC, Australia',
  city: 'Melbourne',
  country: 'AU',
  administrativeArea: 'VIC',
  postcode: '3000',
  latitude: -37.8194151,
  longitude: 144.9587173,
  placeId: 'ChIJSbxDdE1d1moRH2k6XGXt9Zc',
  viewPort: {
    northEast: {
      latitude: -37.8183041697085,
      longitude: 144.9600803802915,
    },
    southWest: {
      latitude: -37.8210021302915,
      longitude: 144.9573824197085,
    },
  },
};

export const defaultVizAbnDetails: VizFullQuotePayload['abnDetails'] = {
  abn: '83608757339',
  businessName: 'TRES ABOGADOS PTY LTD',
  entityDescription: 'Private Company',
  entityDate: '2015-10-15',
  state: 'VIC',
  postcode: '3000',
};

export const defaultVizFullQuoteOccupations: VizFullQuotePayload['occupations'] = [
  {
    occupationId: '51a52b8b-6119-4256-93ea-31e795d0b8fe',
    secondDeclaration: false,
  },
];

/** Static full quote body template; quoteId and clientInformation come from quick quote. */
export const defaultVizFullQuoteTemplate: Omit<
  VizFullQuotePayload,
  'quoteId' | 'clientInformation' | 'metadata'
> = {
  companyRevenue: 2345,
  companyName: 'TRES ABOGADOS PTY LTD',
  companyAddress: defaultVizCompanyAddress,
  abnDetails: defaultVizAbnDetails,
  nswSdExempt: true,
  subContractorServiceEngagement: false,
  hasBusinessDeclarationIssues: false,
  state: 'VIC',
  aggregateLimit: 5000000,
  excess: 500,
  policyStartDate: '',
  policyExpiryDate: '',
  occupations: defaultVizFullQuoteOccupations,
  isMonthlySubscription: false,
  tools: {
    include: true,
    items: [{ description: 'testA', value: '3000' }],
    excessAmount: 500,
  },
  taxAudit: {
    include: true,
    excessAmount: 500,
  },
};

export function buildDefaultVizPolicyDates(): {
  policyStartDate: string;
  policyExpiryDate: string;
} {
  const { year, month, day } = getMelbourneDateParts();

  return {
    policyStartDate: toIsoDate(year, month, day),
    policyExpiryDate: toIsoDate(year + 1, month, day),
  };
}

function getMelbourneDateParts(date = new Date()): {
  year: number;
  month: number;
  day: number;
} {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
  };
}

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
