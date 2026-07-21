const Sequencer = require('@jest/test-sequencer').default;

/**
 * Runs Viz test files in numeric prefix order (00 → 08).
 * Jest's default sequencer does not guarantee this even with --runInBand.
 */
class VizTestSequencer extends Sequencer {
  sort(tests) {
    return [...tests].sort((testA, testB) =>
      testA.path.localeCompare(testB.path),
    );
  }
}

module.exports = VizTestSequencer;
