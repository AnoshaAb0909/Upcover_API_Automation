import { buildVizQuoteDocsEmailPayload } from '../../../products/viz/data/quoteDocsEmail.payload';
import { VIZ_NOTIFICATION_EMAIL } from '../../../products/viz/data/vizNotificationEmail';
import {
  buildVizFullQuotePayload,
  buildVizMonthlyFullQuotePayload,
} from '../../../products/viz/data/fullQuote.payload';
import { buildVizQuickQuotePayload } from '../../../products/viz/data/quickQuote.payload';
import { createVizFullQuote } from '../../../products/viz/services/fullQuote.service';
import { emailVizQuoteDocs } from '../../../products/viz/services/quoteDocsEmail.service';
import { createVizQuickQuoteWithRetry } from '../../../products/viz/services/quickQuote.service';
import type { VizFullQuoteResponse } from '../../../products/viz/types/fullQuote.types';
import type { VizQuickQuoteResponse } from '../../../products/viz/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

async function runVizQuoteDocsEmailFlow(
  buildFullQuote: (
    quickQuote: VizQuickQuoteResponse,
  ) => ReturnType<typeof buildVizFullQuotePayload>,
): Promise<void> {
  const quickQuoteResponse = await createVizQuickQuoteWithRetry(
    buildVizQuickQuotePayload,
  );

  expectApiStatus(quickQuoteResponse, 201);

  const quickQuote = quickQuoteResponse.body as VizQuickQuoteResponse;
  const fullQuoteResponse = await createVizFullQuote(buildFullQuote(quickQuote));

  expectApiStatus(fullQuoteResponse, 201);

  const fullQuote = fullQuoteResponse.body as VizFullQuoteResponse;
  const emailPayload = buildVizQuoteDocsEmailPayload(fullQuote);

  expect(emailPayload.quoteId).toBe(fullQuote.fullQuote.id);
  expect(emailPayload.email).toBe(VIZ_NOTIFICATION_EMAIL);

  const emailResponse = await emailVizQuoteDocs(emailPayload);

  expect(emailResponse.status).not.toBe(400);
  expect(emailResponse.status).not.toBe(401);
  expectApiStatus(emailResponse, 201);
}

describe('Viz Quote Docs Email API', () => {
  it(
    'should email quote docs for annual full quote',
    async () => {
      await runVizQuoteDocsEmailFlow((quickQuote) =>
        buildVizFullQuotePayload(quickQuote),
      );
    },
    300000,
  );

  it(
    'should email quote docs for monthly full quote',
    async () => {
      await runVizQuoteDocsEmailFlow(buildVizMonthlyFullQuotePayload);
    },
    300000,
  );
});
