export interface MotorTotAddressViewPortPoint {
  latitude: number;
  longitude: number;
}

export interface MotorTotAddressViewPort {
  northEast: MotorTotAddressViewPortPoint;
  southWest: MotorTotAddressViewPortPoint;
}

export interface MotorTotAddress {
  placeId: string;
  name: string;
  address: string;
  state: string;
  postcode: string;
  locality: string;
  latitude: number;
  longitude: number;
  viewPort: MotorTotAddressViewPort;
}

export interface MotorTotClientInformation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  occupation: string;
  businessName: string;
  abn: string;
  businessAddress: {
    address: MotorTotAddress;
  };
  operatingYears: number;
}

export interface MotorTotQuickQuoteVehicle {
  rego?: string;
  state: string;
  year: string;
  make: string;
  model: string;
  capitalCost: string;
  capitalCostSource: string;
  isNotRegistered: boolean;
  variantId: string;
  contractNo: string;
  vehicleSegment: string;
  vehicleType: string;
  accName?: string;
  accNo?: string;
  isEV: boolean;
}

export interface MotorTotQuickQuotePayload {
  clientId: string;
  clientInformation: MotorTotClientInformation;
  vehicles: MotorTotQuickQuoteVehicle[];
  hasOtherBusinessLocations: string;
  isInstantQuote: boolean;
  existingPolicy: boolean;
  noExistingPolicyReason: string;
}
