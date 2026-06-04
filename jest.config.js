module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/types/**'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
