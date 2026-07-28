import {
  runCoalitionFullQuoteStep,
  runCoalitionPaymentStep,
  runCoalitionQuickQuoteStep,
  runCoalitionQuoteDocsStep,
} from './coalitionSubscriptionFlow';

describe('Coalition Annual Flow', () => {
  it(
    'should create annual quick quote',
    async () => {
      await runCoalitionQuickQuoteStep('annual');
    },
    300000,
  );

  it(
    'should create annual full quote from quick quote',
    async () => {
      await runCoalitionFullQuoteStep('annual');
    },
    300000,
  );

  it(
    'should email quote docs for annual full quote',
    async () => {
      await runCoalitionQuoteDocsStep('annual');
    },
    300000,
  );

  it(
    'should post annual payment for full quote',
    async () => {
      await runCoalitionPaymentStep('annual');
    },
    300000,
  );
});
