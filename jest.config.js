module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/packages/docsearch-*/src/__tests__/*.test.(ts|tsx)'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/packages/docsearch-*/node_modules/',
  ],
  transform: {
    '^.+\\.(tsx|ts|js)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/scripts/jest/setupTests.ts'],
  testEnvironment: 'jsdom',
  globals: {
    __DEV__: true,
  },
};
