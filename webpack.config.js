const path = require('path');
var webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

/* const autoprefixer = require('autoprefixer')
const postCSSLoaderOptions = {
  // Necessary for external CSS imports to work
  // https://github.com/facebook/create-react-app/issues/2677
  ident: 'postcss',
  plugins: () => [
    require('postcss-flexbugs-fixes'),
    autoprefixer({
      flexbox: 'no-2009',
    }),
  ],
} */

module.exports = {
	plugins: [new webpack.EnvironmentPlugin(['cool']),
		// new BundleAnalyzerPlugin()
	],
	// plugins: [new BundleAnalyzerPlugin()],
	watch: true,
	optimization: {
		splitChunks: {
			chunks: 'initial'
		}
	},
	// devtool: 'cheap-eval-source-map',
	mode: 'production',
	entry: './src/index.tsx',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'bundle.js'
		// publicPath: "/public/"
	},
	resolve: {
	
		alias: {
			moment: 'dayjs',
			'@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/icons.js')
		},
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: ['.ts', '.tsx', '.js', '.json']
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader'
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	devServer: {
		watchContentBase: true,
		historyApiFallback: true
	}
	/* externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
    // 'prop-types': 'PropTypes',
    // firebase: 'firebase',
    'chart.js': 'Chart',
  }, */
};
