const path = require('path');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotenvPlugin = require('dotenv-webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

let mode = 'development';
let target = 'web';
let envPath = path.resolve(__dirname, './.env.development');
let devtool = 'source-map';

const plugins = [
	new HtmlWebpackPlugin({
		template: './public/index.html',
	}),
	new MiniCssExtractPlugin({
		filename: 'css/[name].[contenthash].css',
	}),
];

if (process.env.NODE_ENV === 'production') {
	mode = 'production';
	envPath = path.resolve(__dirname, './.env.production');
	devtool = false;
} else {
	plugins.push(new ReactRefreshWebpackPlugin());
}

plugins.unshift(new DotenvPlugin({ path: envPath }));

module.exports = {
	entry: './src/index.tsx',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'js/[name].[contenthash].bundle.js',
		assetModuleFilename: 'assets/[hash][ext][query]',
		clean: true,
	},
	mode,
	devtool,
	target,
	module: {
		rules: [
			{
				test: /\.svg$/,
				use: ['@svgr/webpack', 'url-loader'],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				type: 'asset',
			},
			{
				test: /\.(ts|tsx|js|jsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.(scss|sass|css)$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				loader: 'url-loader',
			},
		],
	},
	plugins,
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},
	devServer: {
		contentBase: path.resolve(__dirname, 'build'),
		hot: true,
		port: 3000,
		open: true,
		historyApiFallback: true,
	},
};
