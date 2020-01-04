const path = require('path');
const Dotenv = require('dotenv-webpack');

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
    plugins: [new Dotenv()],

    mode: 'production',
    entry: './src/index.tsx',
    optimization: {
        splitChunks: {
            chunks: 'initial'
        }
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js',
        // filename: 'bundle.js'
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
            }
            ,
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
    /* externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'prop-types': 'PropTypes',
      // firebase: 'firebase',
      'chart.js': 'Chart',
    }, */
};
