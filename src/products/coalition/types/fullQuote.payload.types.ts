export interface FullQuoteAddress {
  street: string;
  city: string;
  country: string;
  administrativeArea: string;
  postcode: string;
  placeId: string;
  viewPort: {
    northEast: { latitude: number; longitude: number };
    southWest: { latitude: number; longitude: number };
  };
  latitude?: number;
  longitude?: number;
}

export interface FullQuoteClientInformation {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: Omit<FullQuoteAddress, 'latitude' | 'longitude'>;
}

export interface FullQuoteDeclarations {
  piiPhi: string;
  backupAndRestore: string;
  mfaEmail: string;
  mfaRemoteAccess: string;
  mfaOtherPrivilegedAccounts: string;
  dualControl5k: string;
  awareOfPriorClaims: string;
  awareOfNewClaims: string;
  engagedIndustries: unknown[];
  encryptsData: string;
  contentComplaints: string;
  hasDomains: string;
  reviewsContent: string;
  priorClaims: string;
  revenueAuActPercentage: number;
  revenueAuNswPercentage: number;
  revenueAuNtPercentage: number;
  revenueAuOverseasPercentage: number;
  revenueAuQldPercentage: number;
  revenueAuSaPercentage: number;
  revenueAuTasPercentage: number;
  revenueAuVicPercentage: number;
  revenueAuWaPercentage: number;
}

export interface FullQuotePayload {
  quoteId: string;
  companyIndustry: { id: number };
  bundle: string;
  companyRevenue: number;
  companyName: string;
  companyAddress: FullQuoteAddress;
  abnDetails: {
    abn: string;
    businessName: string;
    entityDescription: string;
    entityDate: string;
    state: string;
    postcode: string;
  };
  clientInformation: FullQuoteClientInformation;
  declarations: FullQuoteDeclarations;
  employeeCount: number;
  companyGrossProfitNetRevenue: number;
  aggregateLimit: number;
  defaultRetention: number;
  policyStartDate: string;
  policyExpiryDate: string;
  isMonthlySubscription: boolean;
  domainNames: string[];
  occupation: string;
  metadata: {
    quoteId: string;
    viewType?: string;
  };
}
