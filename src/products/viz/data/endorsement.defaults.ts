import type { VizOptionalCover } from '../types/fullQuote.payload.types';

/** Additional activity appended to the bound policy occupations on endorsement. */
export const vizEndorsementAdditionalOccupation = {
  occupationId: '8a50c7ba-17ce-4a9f-bcc6-f93c390774f2',
};

export const vizEndorsementToolsTemplate: VizOptionalCover = {
  include: true,
  items: [{ description: 'hammer', value: '5000' }],
  excessAmount: 1000,
};

export const vizEndorsementTaxAuditTemplate: Omit<VizOptionalCover, 'items'> = {
  include: true,
  excessAmount: 500,
};
