const Sequencer = require('@jest/test-sequencer').default;

const PRODUCT_RUN_ORDER = ['coalition', 'viz', 'ahp', 'motorTot'];

function productRank(testPath) {
  const index = PRODUCT_RUN_ORDER.findIndex((product) =>
    testPath.includes(`/products/${product}/`),
  );
  return index === -1 ? PRODUCT_RUN_ORDER.length : index;
}

/**
 * Runs CI suites Coalition → Viz → AHP, then numeric file order within each product.
 */
class CiTestSequencer extends Sequencer {
  sort(tests) {
    return [...tests].sort((testA, testB) => {
      const rankDiff = productRank(testA.path) - productRank(testB.path);
      if (rankDiff !== 0) {
        return rankDiff;
      }

      return testA.path.localeCompare(testB.path);
    });
  }
}

module.exports = CiTestSequencer;
