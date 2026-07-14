import { buildDefaultClientAddress } from './fullQuote.defaults';
import type { FullQuotePayload } from '../types/fullQuote.payload.types';
import type { QuickQuoteResponse } from '../types/quickQuote.types';

export const ANNUAL_FULL_QUOTE_PHONE_NUMBER = '0456789870';

export const annualFullQuoteDeclarations: FullQuotePayload['declarations'] = {
  piiPhi: 'No',
  backupAndRestore: 'Yes',
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

/** Annual-only full quote fields; company and client data come from the quick quote. */
export function buildAnnualFullQuoteOverrides(
  quickQuote: QuickQuoteResponse,
): Partial<FullQuotePayload> {
  const { companyAddress, companyRevenue, clientInformation } = quickQuote.req;

  return {
    declarations: annualFullQuoteDeclarations,
    clientInformation: {
      ...clientInformation,
      address: buildDefaultClientAddress(companyAddress),
    },
    employeeCount: 56,
    companyGrossProfitNetRevenue: companyRevenue,
    defaultRetention: 1000,
    domainNames: [],
    metadata: {
      quoteId: '',
      viewType: 'contactDetails',
    },
  };
}
