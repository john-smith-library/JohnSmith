module.exports = {
  preset: 'ts-jest',
  coverageReporters: ["json-summary", "clover", "json", "lcov", "text"],
  testEnvironment: 'jsdom',
    testPathIgnorePatterns: ["/node_modules/", '/__tests__/_helpers.ts'],
    globals: {
      'js-test': {
        tsconfig: {
            "compilerOptions": {
                "target": "es6",
                "module": "commonjs",
                "declaration": true,
                "outDir": "./dist_test",
                "strict": true
            }
        }
      }
    },
    //"testRegex": "(/tests_e2e/.*|\\.(test|spec))\\.(ts|tsx)$",
    //"testMatch": null,
    //"moduleFileExtensions": ["js", "json", "jsx"]
};
