import type { VizFullQuotePayload } from '../types/fullQuote.payload.types';

export const vizEndorsementFullQuoteCompanyAddress: VizFullQuotePayload['companyAddress'] =
  {
    street: '43 Herschel Street, Brisbane City QLD, Australia',
    city: 'Brisbane City',
    country: 'AU',
    administrativeArea: 'QLD',
    postcode: '4000',
    latitude: -27.4677954,
    longitude: 153.0193845,
    placeId: 'ChIJizy_TAFakWsRdjKs2pS3ags',
    viewPort: {
      northEast: {
        latitude: -27.4663898197085,
        longitude: 153.0206745302915,
      },
      southWest: {
        latitude: -27.4690877802915,
        longitude: 153.0179765697085,
      },
    },
  };

export const vizEndorsementFullQuoteAbnDetails: VizFullQuotePayload['abnDetails'] = {
  abn: '32124165090',
  businessName: 'T R & E OLDLAND',
  entityDescription: 'Private Company',
  entityDate: '2005-11-05',
  state: 'QLD',
  postcode: '4000',
};

/** Static monthly full quote template for the Viz endorsement flow. */
export const vizEndorsementMonthlyFullQuoteTemplate: Omit<
  VizFullQuotePayload,
  'quoteId' | 'clientInformation' | 'metadata' | 'policyStartDate' | 'policyExpiryDate'
> = {
  companyRevenue: 2323,
  companyName: 'T R & E OLDLAND',
  companyAddress: vizEndorsementFullQuoteCompanyAddress,
  abnDetails: vizEndorsementFullQuoteAbnDetails,
  nswSdExempt: true,
  subContractorServiceEngagement: false,
  hasBusinessDeclarationIssues: false,
  state: 'QLD',
  aggregateLimit: 5000000,
  excess: 500,
  occupations: [
    {
      occupationId: '51a52b8b-6119-4256-93ea-31e795d0b8fe',
      secondDeclaration: false,
    },
  ],
  isMonthlySubscription: true,
  tools: {
    include: false,
    items: [],
    excessAmount: 0,
  },
  taxAudit: {
    include: false,
    excessAmount: 0,
  },
};

export const vizEndorsementAnnualFullQuoteCompanyAddress: VizFullQuotePayload['companyAddress'] =
  {
    street: '448 Epsom Road, Flemington VIC, Australia',
    city: 'Flemington',
    country: 'AU',
    administrativeArea: 'VIC',
    postcode: '3031',
    latitude: -37.7879181,
    longitude: 144.9135048,
    placeId: 'ChIJF5y1UQZd1moR9ihUuSpRj8c',
    viewPort: {
      northEast: {
        latitude: -37.7864612697085,
        longitude: 144.9148276802915,
      },
      southWest: {
        latitude: -37.7891592302915,
        longitude: 144.9121297197085,
      },
    },
  };

export const vizEndorsementAnnualFullQuoteAbnDetails: VizFullQuotePayload['abnDetails'] = {
  abn: '64690229862',
  businessName: 'TES ADVISORY PTY LTD',
  entityDescription: 'Private Company',
  entityDate: '2025-08-21',
  state: 'VIC',
  postcode: '3031',
};

/** Static annual full quote template for the Viz endorsement flow. */
export const vizEndorsementAnnualFullQuoteTemplate: Omit<
  VizFullQuotePayload,
  'quoteId' | 'clientInformation' | 'metadata' | 'policyStartDate' | 'policyExpiryDate'
> = {
  companyRevenue: 3456,
  companyName: 'TES ADVISORY PTY LTD',
  companyAddress: vizEndorsementAnnualFullQuoteCompanyAddress,
  abnDetails: vizEndorsementAnnualFullQuoteAbnDetails,
  nswSdExempt: true,
  subContractorServiceEngagement: false,
  hasBusinessDeclarationIssues: false,
  state: 'VIC',
  aggregateLimit: 5000000,
  excess: 500,
  occupations: [
    {
      occupationId: '51a52b8b-6119-4256-93ea-31e795d0b8fe',
      secondDeclaration: false,
    },
  ],
  isMonthlySubscription: false,
  tools: {
    include: false,
    items: [],
    excessAmount: 0,
  },
  taxAudit: {
    include: false,
    excessAmount: 0,
  },
};
