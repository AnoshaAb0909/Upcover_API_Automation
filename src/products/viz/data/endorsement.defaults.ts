import type { VizOptionalCover } from '../types/fullQuote.payload.types';

/** Additional activity for monthly endorsement flows. */
export const vizEndorsementMonthlyAdditionalOccupation = {
  occupationId: '8a50c7ba-17ce-4a9f-bcc6-f93c390774f2',
};

/** Additional activity for annual endorsement flows. */
export const vizEndorsementAnnualAdditionalOccupation = {
  occupationId: '95ff4d58-ccda-402e-a348-6d4950464cf5',
};

/** @deprecated Use vizEndorsementMonthlyAdditionalOccupation */
export const vizEndorsementAdditionalOccupation = vizEndorsementMonthlyAdditionalOccupation;

export const vizEndorsementToolsTemplate: VizOptionalCover = {
  include: true,
  items: [{ description: 'hammer', value: '5000' }],
  excessAmount: 1000,
};

export const vizEndorsementTaxAuditTemplate: Omit<VizOptionalCover, 'items'> = {
  include: true,
  excessAmount: 500,
};

export type VizEndorsementBillingMode = 'annual' | 'monthly';

export function resolveVizEndorsementAdditionalOccupation(
  billingMode: VizEndorsementBillingMode,
): { occupationId: string } {
  return billingMode === 'annual'
    ? vizEndorsementAnnualAdditionalOccupation
    : vizEndorsementMonthlyAdditionalOccupation;
}
