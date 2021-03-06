const path = require('path');
const Dotenv = require('dotenv-webpack');
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
	plugins: [
		new Dotenv(),
		// new webpack.EnvironmentPlugin(['cool'])

		// new BundleAnalyzerPlugin()
	],
	// plugins: [new BundleAnalyzerPlugin()],
	// watch: true,
	optimization: {
		splitChunks: {
			chunks: 'initial'
		}
	},
	// devtool: 'eval',
	// devtool: 'inline-source-map',
	// Use a eval-source-map variant for incremental builds.
	// n most cases, cheap-module-eval-source-map is the best option.
	devtool: 'eval-source-map',
	cache: true,
	mode: 'development',
	entry: './src/index.tsx',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: '[name].bundle.js',
		// filename: 'bundle.js'
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
				loader: 'ts-loader',
				//this is for dev use only
				// it does speed things up
				options: {
					transpileOnly: true,
					experimentalWatchApi: true,
				},
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	devServer: {
		watchContentBase: true,
		historyApiFallback: true,
		contentBase: path.join(__dirname, 'public'),
		compress: true,
		port: 9000
	}
	/* externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
    // 'prop-types': 'PropTypes',
    // firebase: 'firebase',
    'chart.js': 'Chart',
  }, */
};
