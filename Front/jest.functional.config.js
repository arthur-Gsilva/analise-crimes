module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.functional.test.js'],
  testTimeout: 120000,
  verbose: true,
  bail: false,
  maxWorkers: 1,
  detectOpenHandles: true,
  forceExit: true,
};
