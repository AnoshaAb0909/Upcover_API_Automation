import {
  runCoalitionFullQuoteStep,
  runCoalitionPaymentStep,
  runCoalitionQuickQuoteStep,
  runCoalitionQuoteDocsStep,
} from './coalitionSubscriptionFlow';

describe('Coalition Monthly Flow', () => {
  it(
    'should create monthly quick quote',
    async () => {
      await runCoalitionQuickQuoteStep('monthly');
    },
    300000,
  );

  it(
    'should create monthly full quote from quick quote',
    async () => {
      await runCoalitionFullQuoteStep('monthly');
    },
    300000,
  );

  it(
    'should email quote docs for monthly full quote',
    async () => {
      await runCoalitionQuoteDocsStep('monthly');
    },
    300000,
  );

  it(
    'should post monthly payment for full quote',
    async () => {
      await runCoalitionPaymentStep('monthly');
    },
    300000,
  );
});
