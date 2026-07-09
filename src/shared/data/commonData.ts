export const commonData = {
  companyName: 'RIP CURL PROPRIETARY LIMITED',
  email: 'hassan+sds@upcover.com',
  address: '11 Bale Circuit, Southbank VIC, Australia',
  latitude: -37.8261925,
  longitude: 144.9628692,
  occupation: {
    coalition: [
      'Accountant',
      'Accounting service',
      'Accountants Association Operation',
    ],
    ahp: [
      'Spiritual Healing Therapist',
      'Light',
      'High Frequency Facial',
    ],
    viz: [] as string[],
  },
};

export type ProductKey = keyof typeof commonData.occupation;

export function pickOccupation(product: ProductKey): string {
  const arr = commonData.occupation[product];
  return arr[Math.floor(Math.random() * arr.length)] || '';
}
