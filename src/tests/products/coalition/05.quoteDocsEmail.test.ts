import { buildQuoteDocsEmailPayload } from '../../../products/coalition/data/quoteDocsEmail.payload';
import { buildFullQuotePayload, buildMonthlyFullQuotePayload } from '../../../products/coalition/data/fullQuote.payload';
import { buildQuickQuotePayload } from '../../../products/coalition/data/quickQuote.payload';
import { createFullQuote } from '../../../products/coalition/services/fullQuote.service';
import { emailQuoteDocs } from '../../../products/coalition/services/quoteDocsEmail.service';
import { createQuickQuoteWithRetry } from '../../../products/coalition/services/quickQuote.service';
import type { FullQuoteResponse } from '../../../products/coalition/types/fullQuote.types';
import type { QuickQuoteResponse } from '../../../products/coalition/types/quickQuote.types';
import { expectApiStatus } from '../../helpers/expectApiStatus';

async function runQuoteDocsEmailFlow(
  buildFullQuote: (quickQuote: QuickQuoteResponse) => ReturnType<typeof buildFullQuotePayload>,
): Promise<void> {
  const quickQuoteResponse = await createQuickQuoteWithRetry(buildQuickQuotePayload);

  expectApiStatus(quickQuoteResponse, 201);

  const quickQuote = quickQuoteResponse.body as QuickQuoteResponse;
  const fullQuoteResponse = await createFullQuote(buildFullQuote(quickQuote));

  expectApiStatus(fullQuoteResponse, 201);

  const fullQuote = fullQuoteResponse.body as FullQuoteResponse;
  const emailPayload = buildQuoteDocsEmailPayload(fullQuote);

  expect(emailPayload.quoteId).toBe(fullQuote.fullQuote.id);
  expect(emailPayload.email).toBe(fullQuote.fullQuote.req.clientInformation.email);

  const emailResponse = await emailQuoteDocs(emailPayload);

  expect(emailResponse.status).not.toBe(400);
  expect(emailResponse.status).not.toBe(401);
  expectApiStatus(emailResponse, 200);
}

describe('Coalition Quote Docs Email API', () => {
  it(
    'should email quote docs for annual full quote',
    async () => {
      await runQuoteDocsEmailFlow((quickQuote) =>
        buildFullQuotePayload(quickQuote, { isMonthlySubscription: false }),
      );
    },
    300000,
  );

  it(
    'should email quote docs for monthly full quote',
    async () => {
      await runQuoteDocsEmailFlow(buildMonthlyFullQuotePayload);
    },
    300000,
  );
});
