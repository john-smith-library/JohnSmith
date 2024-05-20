module.exports = {
    preset: 'ts-jest',
    coverageReporters: ["json-summary", "clover", "json", "lcov", "text"],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ["/node_modules/", '/__tests__/_helpers.ts'],
};
