import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/*.test.ts'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup/jest.setup.ts'],
  testTimeout: 300000,
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Upcover API Test Report',
        outputPath: './reports/test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
};

export default config;
