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
  {
    companyName: 'R E S PTY LTD',
    companyRevenue: 233223,
    companyIndustry: { id: 149 },
    companyAddress: {
      street: '568 Collins Street, Melbourne VIC, Australia',
      city: 'Melbourne',
      country: 'AU',
      administrativeArea: 'VIC',
      postcode: '3000',
      placeId: 'ChIJ5ZCrCU5d1moR8SnFdDx1lmE',
      viewPort: {
        northEast: {
          latitude: -37.8171438697085,
          longitude: 144.9568924802915,
        },
        southWest: {
          latitude: -37.8198418302915,
          longitude: 144.9541945197085,
        },
      },
      latitude: -37.8183996,
      longitude: 144.9555052,
    },
    abnDetails: {
      abn: '52622726390',
      businessName: 'R E S PTY LTD',
      entityDescription: 'Australian Private Company',
      entityDate: '2017-11-09',
      state: 'VIC',
      postcode: '3000',
    },
    aggregateLimit: 500000,
    occupation: 'Accountant',
  },
  {
    companyName: 'TRES ABOGADOS PTY LTD',
    companyRevenue: 34567,
    companyIndustry: { id: 149 },
    companyAddress: {
      street: '452 Flinders Street, Melbourne VIC, Australia',
      city: 'Melbourne',
      country: 'AU',
      administrativeArea: 'VIC',
      postcode: '3000',
      placeId: 'ChIJSbxDdE1d1moRH2k6XGXt9Zc',
      viewPort: {
        northEast: {
          latitude: -37.8181306,
          longitude: 144.9601188,
        },
        southWest: {
          latitude: -37.8211306,
          longitude: 144.9571188,
        },
      },
      latitude: -37.8196306,
      longitude: 144.9586188,
    },
    abnDetails: {
      abn: '83608757339',
      businessName: 'TRES ABOGADOS PTY LTD',
      entityDescription: 'Australian Private Company',
      entityDate: '2015-10-15',
      state: 'VIC',
      postcode: '3000',
    },
    aggregateLimit: 500000,
    occupation: 'Accounting Service',
  },
  {
    companyName: 'SENSIS PTY LTD',
    companyRevenue: 34567,
    companyIndustry: { id: 149 },
    companyAddress: {
      street: '222 Lonsdale Street, Melbourne VIC, Australia',
      city: 'Melbourne',
      country: 'AU',
      administrativeArea: 'VIC',
      postcode: '3000',
      placeId: 'ChIJ5ZCrCU5d1moR8SnFdDx1lmE',
      viewPort: {
        northEast: {
          latitude: -37.8096335,
          longitude: 144.9666927,
        },
        southWest: {
          latitude: -37.8126335,
          longitude: 144.9636927,
        },
      },
      latitude: -37.8111335,
      longitude: 144.9651927,
    },
    abnDetails: {
      abn: '30007423912',
      businessName: 'SENSIS PTY LTD',
      entityDescription: 'Australian Private Company',
      entityDate: '2000-05-15',
      state: 'VIC',
      postcode: '3000',
    },
    aggregateLimit: 500000,
    occupation: 'Accounting Service',
  },
  {
    companyName: 'REA GROUP LIMITED',
    companyRevenue: 34567,
    companyIndustry: { id: 149 },
    companyAddress: {
      street: '511 Church Street, Richmond VIC, Australia',
      city: 'Richmond',
      country: 'AU',
      administrativeArea: 'VIC',
      postcode: '3121',
      placeId: 'ChIJcxxXbydD1moRZEEuLn-SGRw',
      viewPort: {
        northEast: {
          latitude: -37.8273931,
          longitude: 144.9991364,
        },
        southWest: {
          latitude: -37.8303931,
          longitude: 144.9961364,
        },
      },
      latitude: -37.8288931,
      longitude: 144.9976364,
    },
    abnDetails: {
      abn: '68068349066',
      businessName: 'REA GROUP LIMITED',
      entityDescription: 'Australian Public Company',
      entityDate: '1995-11-30',
      state: 'VIC',
      postcode: '3121',
    },
    aggregateLimit: 500000,
    occupation: 'Accounting Service',
  },
  {
    companyName: 'DOMAIN HOLDINGS AUSTRALIA LIMITED',
    companyRevenue: 34567,
    companyIndustry: { id: 149 },
    companyAddress: {
      street: '55 Pyrmont Street, Pyrmont NSW, Australia',
      city: 'Pyrmont',
      country: 'AU',
      administrativeArea: 'NSW',
      postcode: '2009',
      placeId: 'ChIJrTLr-GyuEmsRBfy61i59si0',
      viewPort: {
        northEast: {
          latitude: -33.8714589,
          longitude: 151.1984392,
        },
        southWest: {
          latitude: -33.8744589,
          longitude: 151.1954392,
        },
      },
      latitude: -33.8729589,
      longitude: 151.1969392,
    },
    abnDetails: {
      abn: '43094154364',
      businessName: 'DOMAIN HOLDINGS AUSTRALIA LIMITED',
      entityDescription: 'Australian Public Company',
      entityDate: '2000-08-15',
      state: 'NSW',
      postcode: '2009',
    },
    aggregateLimit: 500000,
    occupation: 'Accounting Service',
  },
  {
    companyName: 'CAR GROUP LTD',
    companyRevenue: 34567,
    companyIndustry: { id: 149 },
    companyAddress: {
      street: '449 Punt Road, Richmond VIC, Australia',
      city: 'Richmond',
      country: 'AU',
      administrativeArea: 'VIC',
      postcode: '3121',
      placeId: 'ChIJcxxXbydD1moRZEEuLn-SGRw',
      viewPort: {
        northEast: {
          latitude: -37.8196202,
          longitude: 144.9909289,
        },
        southWest: {
          latitude: -37.8226202,
          longitude: 144.9879289,
        },
      },
      latitude: -37.8211202,
      longitude: 144.9894289,
    },
    abnDetails: {
      abn: '77065374915',
      businessName: 'CAR GROUP LTD',
      entityDescription: 'Australian Public Company',
      entityDate: '1997-03-12',
      state: 'VIC',
      postcode: '3121',
    },
    aggregateLimit: 500000,
    occupation: 'Accounting Service',
  },
  {
    companyName: 'SEEK LIMITED',
    companyRevenue: 34567,
    companyIndustry: { id: 149 },
    companyAddress: {
      street: '541 St Kilda Road, Melbourne VIC, Australia',
      city: 'Melbourne',
      country: 'AU',
      administrativeArea: 'VIC',
      postcode: '3004',
      placeId: 'ChIJ5ZCrCU5d1moR8SnFdDx1lmE',
      viewPort: {
        northEast: {
          latitude: -37.8445564,
          longitude: 144.9815437,
        },
        southWest: {
          latitude: -37.8475564,
          longitude: 144.9785437,
        },
      },
      latitude: -37.8460564,
      longitude: 144.9800437,
    },
    abnDetails: {
      abn: '46080075514',
      businessName: 'SEEK LIMITED',
      entityDescription: 'Australian Public Company',
      entityDate: '1997-03-18',
      state: 'VIC',
      postcode: '3004',
    },
    aggregateLimit: 500000,
    occupation: 'Accounting Service',
  },
  {
    companyName: 'TECHNOLOGY ONE LIMITED',
    companyRevenue: 34567,
    companyIndustry: { id: 149 },
    companyAddress: {
      street: '139 Coronation Drive, Milton QLD, Australia',
      city: 'Milton',
      country: 'AU',
      administrativeArea: 'QLD',
      postcode: '4064',
      placeId: 'ChIJM9xlrR1akWsRXxYVJiU5cTI',
      viewPort: {
        northEast: {
          latitude: -27.4673562,
          longitude: 153.0113425,
        },
        southWest: {
          latitude: -27.4703562,
          longitude: 153.0083425,
        },
      },
      latitude: -27.4688562,
      longitude: 153.0098425,
    },
    abnDetails: {
      abn: '68090195616',
      businessName: 'TECHNOLOGY ONE LIMITED',
      entityDescription: 'Australian Public Company',
      entityDate: '1987-06-15',
      state: 'QLD',
      postcode: '4064',
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
