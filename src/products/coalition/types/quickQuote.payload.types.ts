export interface QuickQuotePayload {
  companyRevenue: number;
  companyName: string;
  bundle: string;
  companyIndustry: { id: number };
  companyAddress: {
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
    latitude: number;
    longitude: number;
  };
  abnDetails: {
    abn: string;
    businessName: string;
    entityDescription: string;
    entityDate: string;
    state: string;
    postcode: string;
  };
  clientInformation: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
  aggregateLimit: number;
  occupation: string;
}
