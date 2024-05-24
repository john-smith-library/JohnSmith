module.exports = {
    coverageReporters: ["json-summary", "clover", "json", "lcov", "text"],
    projects: [
        {
            preset: 'ts-jest',
            testEnvironment: 'jsdom',
            displayName: 'e2e',
            testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
            testPathIgnorePatterns: ["/node_modules/", '/__tests__/_helpers.ts'],
            coveragePathIgnorePatterns: ["/node_modules/", '/__tests__/_helpers.ts']
        },
        {
            preset: 'ts-jest',
            displayName: {
                name: 'unit',
                color: 'blue'
            },
            testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
        },
    ],

};
