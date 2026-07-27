import type {
  AhpDeclaration,
  AhpFullQuoteAddress,
  AhpFullQuotePayload,
} from '../types/fullQuote.payload.types';

export const DEFAULT_AHP_PHONE_NUMBER = '0456789877';

export const defaultAhpFullQuoteAddress: AhpFullQuoteAddress = {
  addressLine1: '45 Clarence Street, Sydney NSW, Australia',
  suburb: 'Sydney',
  state: 'NSW',
  postalCode: '2000',
  placeId: 'ChIJMawZK0GuEmsREW82I1Iggfk',
  latitude: -33.8648242,
  longitude: 151.2045196,
};

export const defaultAhpFullQuoteDeclarations: AhpDeclaration[] = [
  { id: '20a5c7f5-eb05-4e9d-9a71-77f927a16f89', answer: '1' },
  { id: '57df1346-0671-4e2e-ae2c-40ac234fe4e6', answer: '1' },
  { id: '8660a6ab-734b-47df-8411-7af256ffa8f9', answer: '1' },
  { id: 'fa2ebb92-b268-4e3f-b004-754c2b17fa8f', answer: '1' },
  { id: '0d6151e6-de93-4568-968d-061b0e73e95e', answer: '1' },
  { id: '6c7754e9-1a86-40e9-bd14-3f45de242728', answer: '2' },
  { id: '6401b5b4-f408-48b2-8455-1fe65debc21d', answer: '2' },
  { id: 'ac24b4e4-9dc9-4616-9e90-55f3b8ea6e47', answer: '2' },
  { id: '84531abb-c979-4c87-97f2-4d8260ec2dcd', answer: '2' },
  { id: '27338457-60f1-4188-91f8-0c8ac60a92de', answer: '2' },
  { id: 'c8b7c699-02c3-4999-9e3a-438a2dd562ea', answer: '2' },
  { id: '285f5a84-044b-4b82-a032-435d58dd7390', answer: '2' },
  { id: 'd5becf8b-4354-463b-8fa6-03fc7fc7330a', answer: '2' },
  { id: 'ae00e551-6ea4-4981-b4e4-fef142d488dd', answer: '2' },
  { id: '8c4add60-8b03-4d7e-bd8a-a4b3c2e7fd68', answer: '2' },
  { id: '1a2b15c2-b83a-4091-9678-cada259d377d', answer: '2' },
  { id: 'b42c0a63-a9e1-48bd-992c-7b14d72d8f93', answer: '2' },
  { id: '60228a7f-8b8b-43af-927a-175f656afa7c', answer: '2' },
  { id: '19edc0cd-b4bf-4461-9364-0f990a3f5094', answer: '2' },
  { id: 'a6475935-0e39-4dab-a462-fdcaec2c06ad', answer: '1' },
];

/** Static FQ template; quoteId, client fields, and QQ-mapped fields are applied in the mapper. */
export const defaultAhpFullQuoteTemplate: Omit<
  AhpFullQuotePayload,
  | 'quoteId'
  | 'occupations'
  | 'policyStartDate'
  | 'insuredName'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'companyName'
  | 'revenueLastFy'
  | 'revenueCurrentFy'
  | 'operatesInMultipleStates'
  | 'statesSplit'
  | 'coverInput'
> = {
  partnerId: 'upcover',
  mobileNumber: DEFAULT_AHP_PHONE_NUMBER,
  address: defaultAhpFullQuoteAddress,
  abn: '83608757339',
  entityDate: '15/10/2015',
  entityDescription: 'Private Company',
  nswSdExempt: false,
  declarations: defaultAhpFullQuoteDeclarations,
  numberOfEmployees: 5,
  isMonthlySubscription: false,
};

export const AHP_STATE_NAMES_BY_ID: Record<string, string> = {
  'e5384a75-8180-4d4c-9859-8e84f4ddb36f': 'NSW',
  '9a369663-399e-4ee8-b995-d404e9a204e4': 'WA',
  'd3d298b6-72c4-4de9-a0a5-6c49243b2058': 'ACT',
};

export const AHP_OCCUPATION_NAMES_BY_ID: Record<string, string> = {
  '595ab40a-588d-4e0e-8090-347f50cc094e': 'Light/Heat Therapy',
  '46e94ac7-7123-4c5c-a7f8-bc293ccb8ecc': 'Reflexology',
};

export function buildDefaultAhpPolicyStartDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${read('day')}/${read('month')}/${read('year')}`;
}

export function buildAhpCompanyName(firstName: string, lastName: string): string {
  return `${lastName.toUpperCase()} ${firstName.toUpperCase()} PTY LTD`;
}
