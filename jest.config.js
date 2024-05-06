module.exports = {
  preset: 'ts-jest',
  coverageReporters: ["json-summary"],
  testEnvironment: 'jsdom',
    testPathIgnorePatterns: ["/node_modules/", '/__tests__/_helpers.ts'],
    globals: {
      'js-test': {
        tsConfig: {
            "compilerOptions": {
                "target": "es5",
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
