const Sequencer = require('@jest/test-sequencer').default;

/**
 * Runs AHP test files in numeric prefix order.
 */
class AhpTestSequencer extends Sequencer {
  sort(tests) {
    return [...tests].sort((testA, testB) =>
      testA.path.localeCompare(testB.path),
    );
  }
}

module.exports = AhpTestSequencer;
