import { pickCoalitionTestCompany } from './coalitionTestCompanies';
import { ANNUAL_FULL_QUOTE_PHONE_NUMBER } from './annualFullQuote.template';
import { generateDummyClientInformation } from '../../../shared/data/dummyData';
import type { QuickQuotePayload } from '../types/quickQuote.payload.types';

const DEFAULT_BUNDLE = 'most_popular';

/** Quick quote for annual flow — rotates company, uses dummy client contact details. */
export function buildAnnualQuickQuotePayload(
  overrides: Partial<QuickQuotePayload> = {},
): QuickQuotePayload {
  const company = pickCoalitionTestCompany();
  const dummyClient = generateDummyClientInformation();

  return {
    bundle: DEFAULT_BUNDLE,
    ...company,
    clientInformation: {
      ...dummyClient,
      phoneNumber:
        overrides.clientInformation?.phoneNumber ?? ANNUAL_FULL_QUOTE_PHONE_NUMBER,
      ...overrides.clientInformation,
    },
    ...overrides,
    companyAddress: {
      ...company.companyAddress,
      ...overrides.companyAddress,
      viewPort: {
        ...company.companyAddress.viewPort,
        ...overrides.companyAddress?.viewPort,
        northEast: {
          ...company.companyAddress.viewPort.northEast,
          ...overrides.companyAddress?.viewPort?.northEast,
        },
        southWest: {
          ...company.companyAddress.viewPort.southWest,
          ...overrides.companyAddress?.viewPort?.southWest,
        },
      },
    },
    abnDetails: {
      ...company.abnDetails,
      ...overrides.abnDetails,
    },
    companyIndustry: {
      ...company.companyIndustry,
      ...overrides.companyIndustry,
    },
  };
}
