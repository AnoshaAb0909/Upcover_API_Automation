const Sequencer = require('@jest/test-sequencer').default;

/**
 * Runs CI test files in path order across Coalition, Viz, and AHP suites.
 */
class CiTestSequencer extends Sequencer {
  sort(tests) {
    return [...tests].sort((testA, testB) =>
      testA.path.localeCompare(testB.path),
    );
  }
}

module.exports = CiTestSequencer;
