const FIRST_NAMES = [
  'Alex',
  'Jordan',
  'Taylor',
  'Morgan',
  'Casey',
  'Riley',
  'Avery',
  'Quinn',
  'Harper',
  'Blake',
];

const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Miller',
  'Davis',
  'Wilson',
  'Anderson',
  'Thomas',
];

function pickRandom<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function createDummySuffix(): string {
  return `${Date.now()}${Math.random().toString(36).slice(2, 8)}`;
}

export function generateDummyEmail(prefix = 'anosha'): string {
  return `${prefix}+${createDummySuffix()}@upcover.com`;
}

export function generateDummyFirstName(): string {
  return pickRandom(FIRST_NAMES);
}

export function generateDummyLastName(): string {
  return pickRandom(LAST_NAMES);
}

export function generateDummyClientInformation(): {
  firstName: string;
  lastName: string;
  email: string;
} {
  return {
    firstName: generateDummyFirstName(),
    lastName: generateDummyLastName(),
    email: generateDummyEmail(),
  };
}
