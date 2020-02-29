module.exports = {
  verbose: true,
  testURL: 'http://localhost',
  setupTestFrameworkScriptFile: './src/js/TestSetup/setupTest.js',
  testMatch: ['**/*.test.js'],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/js/TestSetup/assetMock.js',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.(png)$': '<rootDir>/src/js/TestSetup/fileToFilenameTransformer.js',
  },
  collectCoverage: process.env.COVERAGE !== 'false',
};
