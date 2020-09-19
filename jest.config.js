module.exports = {
  globalSetup: '<rootDir>/__tests__/__jest__/global/setup.js',
  globalTeardown: '<rootDir>/__tests__/__jest__/global/teardown.js',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/__tests__/__jest__'],
  watchPathIgnorePatterns: ['<rootDir>/__tests__/__jest__']
};
