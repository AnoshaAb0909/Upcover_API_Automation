import { pickCoalitionTestCompany } from './coalitionTestCompanies';
import { generateDummyClientInformation } from '../../../shared/data/dummyData';
import type { QuickQuotePayload } from '../types/quickQuote.payload.types';

const DEFAULT_PHONE_NUMBER = '0411111111';
const DEFAULT_BUNDLE = 'most_popular';

export function buildQuickQuotePayload(
  overrides: Partial<QuickQuotePayload> = {},
): QuickQuotePayload {
  const company = pickCoalitionTestCompany();
  const dummyClient = generateDummyClientInformation();

  return {
    bundle: DEFAULT_BUNDLE,
    ...company,
    ...overrides,
    clientInformation: {
      ...dummyClient,
      phoneNumber:
        overrides.clientInformation?.phoneNumber ?? DEFAULT_PHONE_NUMBER,
      ...overrides.clientInformation,
    },
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

export { pickCoalitionTestCompany, coalitionTestCompanies } from './coalitionTestCompanies';
