import type { QuickQuotePayload } from '../types/quickQuote.payload.types';

export type CoalitionTestCompany = Pick<
  QuickQuotePayload,
  | 'companyName'
  | 'companyRevenue'
  | 'companyIndustry'
  | 'companyAddress'
  | 'abnDetails'
  | 'aggregateLimit'
  | 'occupation'
>;

/** Real Australian companies with registered ABNs used for Coalition QA. */
export const coalitionTestCompanies: readonly CoalitionTestCompany[] = [
  {
    companyName: 'RES ARTIS LIMITED',
    companyRevenue: 34567,
    companyIndustry: { id: 149 },
    companyAddress: {
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
    },
    abnDetails: {
      abn: '58647898959',
      businessName: 'RES ARTIS LIMITED',
      entityDescription: 'Australian Public Company',
      entityDate: '2021-02-12',
      state: 'VIC',
      postcode: '3006',
    },
    aggregateLimit: 500000,
    occupation: 'Accounting Service',
  },
  {
    companyName: 'AND THE NEW',
    companyRevenue: 34567,
    companyIndustry: { id: 149 },
    companyAddress: {
      street: '111 Eagle Street, Brisbane City QLD, Australia',
      city: 'Brisbane City',
      country: 'AU',
      administrativeArea: 'QLD',
      postcode: '4000',
      placeId: 'ChIJM9xlrR1akWsRXxYVJiU5cTI',
      viewPort: {
        northEast: {
          latitude: -27.4661247697085,
          longitude: 153.0315735302915,
        },
        southWest: {
          latitude: -27.4688227302915,
          longitude: 153.0288755697085,
        },
      },
      latitude: -27.4673173,
      longitude: 153.0301759,
    },
    abnDetails: {
      abn: '24674204141',
      businessName: 'AND THE NEW ATHLETIC PTY LTD',
      entityDescription: 'Australian Private Company',
      entityDate: '2024-01-15',
      state: 'QLD',
      postcode: '4000',
    },
    aggregateLimit: 500000,
    occupation: 'Accounting Service',
  },
  {
    companyName: 'RIP CURL PROPRIETARY LIMITED',
    companyRevenue: 34567,
    companyIndustry: { id: 149 },
    companyAddress: {
      street: '11 Bale Circuit, Southbank VIC, Australia',
      city: 'Southbank',
      country: 'AU',
      administrativeArea: 'VIC',
      postcode: '3006',
      placeId: 'ChIJcxxXbydD1moRZEEuLn-SGRw',
      viewPort: {
        northEast: {
          latitude: -37.8248138197085,
          longitude: 144.9641652802915,
        },
        southWest: {
          latitude: -37.82751178029149,
          longitude: 144.9614673197085,
        },
      },
      latitude: -37.8261925,
      longitude: 144.9628692,
    },
    abnDetails: {
      abn: '40004838064',
      businessName: 'RIP CURL PROPRIETARY LIMITED',
      entityDescription: 'Australian Private Company',
      entityDate: '1970-07-28',
      state: 'VIC',
      postcode: '3006',
    },
    aggregateLimit: 500000,
    occupation: 'Accounting Service',
  },
];

let companyRotationIndex = 0;

export function pickCoalitionTestCompany(): CoalitionTestCompany {
  const company =
    coalitionTestCompanies[companyRotationIndex % coalitionTestCompanies.length];
  companyRotationIndex += 1;
  return company;
}

export function resetCoalitionTestCompanyRotation(): void {
  companyRotationIndex = 0;
}
