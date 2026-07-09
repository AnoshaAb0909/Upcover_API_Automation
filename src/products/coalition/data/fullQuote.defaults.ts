import type { FullQuotePayload } from '../types/fullQuote.payload.types';

export const defaultFullQuoteCompanyAddress: FullQuotePayload['companyAddress'] = {
  street: '45 Clarke Street, Southbank VIC, Australia',
  city: 'Southbank',
  country: 'AU',
  administrativeArea: 'VIC',
  postcode: '3006',
  placeId: 'ChIJMwpyUaJd1moRRfNg1G4q_QA',
  viewPort: {
    northEast: {
      latitude: -37.8255687697085,
      longitude: 144.9606270302915,
    },
    southWest: {
      latitude: -37.8282667302915,
      longitude: 144.9579290697085,
    },
  },
  latitude: -37.8268878,
  longitude: 144.9593745,
};

export const defaultFullQuoteDeclarations: FullQuotePayload['declarations'] = {
  piiPhi: 'No',
  backupAndRestore: 'No',
  mfaEmail: 'Yes',
  mfaRemoteAccess: 'Yes',
  mfaOtherPrivilegedAccounts: 'Yes',
  dualControl5k: 'Yes',
  awareOfPriorClaims: 'No',
  awareOfNewClaims: 'No',
  engagedIndustries: [],
  encryptsData: 'Sometimes',
  contentComplaints: 'No',
  hasDomains: 'No',
  reviewsContent: 'Yes',
  priorClaims: 'No',
  revenueAuActPercentage: 0,
  revenueAuNswPercentage: 100,
  revenueAuNtPercentage: 0,
  revenueAuOverseasPercentage: 0,
  revenueAuQldPercentage: 0,
  revenueAuSaPercentage: 0,
  revenueAuTasPercentage: 0,
  revenueAuVicPercentage: 0,
  revenueAuWaPercentage: 0,
};

export function buildDefaultClientAddress(
  companyAddress: FullQuotePayload['companyAddress'],
): FullQuotePayload['clientInformation']['address'] {
  return {
    street: '45 Clarke St',
    city: companyAddress.city,
    country: companyAddress.country,
    administrativeArea: companyAddress.administrativeArea,
    postcode: companyAddress.postcode,
    placeId: companyAddress.placeId,
    viewPort: companyAddress.viewPort,
  };
}

export function buildDefaultPolicyDates(): {
  policyStartDate: string;
  policyExpiryDate: string;
} {
  const start = new Date();
  const expiry = new Date(start);
  expiry.setFullYear(expiry.getFullYear() + 1);
  expiry.setUTCMonth(6);
  expiry.setUTCDate(31);
  expiry.setUTCHours(18, 29, 59, 0);

  return {
    policyStartDate: start.toISOString(),
    policyExpiryDate: expiry.toISOString(),
  };
}

export const PROFESSIONAL_INDEMNITY_COVER_ID =
  'c076cd1f-e25d-4d49-8636-6b8334cb7074';

export const PUBLIC_PRODUCTS_LIABILITY_COVER_ID =
  '2e74a004-8319-43cd-a618-7e5de4807e19';
