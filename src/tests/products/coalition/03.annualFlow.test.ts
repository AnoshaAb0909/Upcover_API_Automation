import { runCoalitionSubscriptionFlow } from './coalitionSubscriptionFlow';

describe('Coalition Annual Flow', () => {
  it(
    'should run QQ → FQ → quote docs email → payment',
    async () => {
      await runCoalitionSubscriptionFlow('annual');
    },
    600000,
  );
});
