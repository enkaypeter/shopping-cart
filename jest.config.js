module.exports = {
 
  bail: true,
  
  collectCoverage: false,
  runner: "jest-serial-runner",

  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],

  setupFiles: ['dotenv/config'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

}