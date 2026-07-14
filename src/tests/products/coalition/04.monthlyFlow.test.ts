import { runCoalitionSubscriptionFlow } from './coalitionSubscriptionFlow';

describe('Coalition Monthly Flow', () => {
  it(
    'should run QQ → FQ → quote docs email → payment',
    async () => {
      await runCoalitionSubscriptionFlow('monthly');
    },
    600000,
  );
});
