const baseConfig = require('../jest.config');

module.exports = {
  ...baseConfig,
  rootDir: '../',
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>'],
  coveragePathIgnorePatterns: [
    '/dist/',
    '/node_modules/',
    '/testing/',
    '\\.routes\\.ts',
    '\\.selectors\\.ts',
    '\\.providers\\.ts',
    '\\.payload-mutator\\.ts',
    '\\.side-effect\\.ts',
    '\\.flow-manager\\.ts',
  ],
};
