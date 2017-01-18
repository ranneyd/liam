const CompressionPlugin = require('compression-webpack-plugin');
const validate = require('webpack-validator');

module.exports = validate({
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js"
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ["", ".webpack.config.babel.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],
        plugins: [
            new CompressionPlugin({ 
	    	asset: "[path].gz[query]"
		algorithm: "gzip",
		test: /\.js$|\.html$|!node_modules\/|!dist\//,
		threshold: 1020,
		minRatio: 0.8
	    })
        ]
    }
})
