module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
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
    }
};