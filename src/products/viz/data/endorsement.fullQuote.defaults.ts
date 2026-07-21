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
