module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>/src'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/modules/**/*.ts',
    '!src/modules/**/routes/*.ts',
    '!src/modules/**/models/*.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/config/jest.setup.ts']
};
