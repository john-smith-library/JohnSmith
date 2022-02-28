const glob = require('glob');
const path = require('path');

module.exports = {
    entry: glob.sync('./**/index.tsx').reduce((acc, path) => {
        const entry = path.replace('/index.tsx', '')
        acc[entry] = path
        return acc
    }, {}),

    output: {
        filename: './[name]/index.js',
        path: path.resolve(__dirname, '../dist_tutorial')
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    }
}
