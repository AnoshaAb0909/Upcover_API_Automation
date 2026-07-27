export interface AhpOccupationInput {
  id: string;
  percentage: number;
}

export interface AhpStateInput {
  id: string;
  percentage: number;
}

export interface AhpCoverLimit {
  name: string;
  value: number;
}

export interface AhpCoverInput {
  coverId: string;
  limits: AhpCoverLimit[];
}

export interface AhpQuickQuotePayload {
  occupations: AhpOccupationInput[];
  states: AhpStateInput[];
  averageRevenue: number;
  coverInput: AhpCoverInput[];
}
