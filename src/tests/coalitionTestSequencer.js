const Sequencer = require('@jest/test-sequencer').default;

/**
 * Runs Coalition test files in numeric prefix order (01 → 06).
 * Jest's default sequencer does not guarantee this even with --runInBand.
 */
class CoalitionTestSequencer extends Sequencer {
  sort(tests) {
    return [...tests].sort((testA, testB) =>
      testA.path.localeCompare(testB.path),
    );
  }
}

module.exports = CoalitionTestSequencer;
