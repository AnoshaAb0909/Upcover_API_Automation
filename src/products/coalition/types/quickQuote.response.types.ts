export interface QuickQuoteApplicationResponses {
  awareOfNewClaims: string;
  backupAndRestore: string;
  contentComplaints: string;
  dualControl: string;
  encryptsData: string;
  hasDomains: string;
  mfaEmail: string;
  mfaOtherPrivilegedAccounts: string;
  mfaRemoteAccess: string;
  piiPhi: string;
  priorClaims: string;
  reviewsContent: string;
  revenueAuActPercentage: number;
  revenueAuNswPercentage: number;
  revenueAuNtPercentage: number;
  revenueAuOverseasPercentage: number;
  revenueAuQldPercentage: number;
  revenueAuSaPercentage: number;
  revenueAuTasPercentage: number;
  revenueAuVicPercentage: number;
  revenueAuWaPercentage: number;
  [key: string]: unknown;
}

export interface QuickQuoteCoalitionResponse {
  accountUuid: string;
  aggregateLimit: number;
  applicationResponses: QuickQuoteApplicationResponses;
  bundle: string;
  companyName: string;
  companyRevenue: number;
  currencyCode: string;
  defaultRetention: number;
  domainNames: string[];
  effectiveDate: string;
  employeeCount: number;
  endDate: string;
  lifecycleState: string;
  phantomQuoteId: string;
  policyVersion: string;
  premium: number;
  underwritingComplete: boolean;
  uuid: string;
  [key: string]: unknown;
}
