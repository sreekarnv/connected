module.exports = (api) => {
	const plugins = [];

	if (api.env('development')) {
		plugins.push('react-refresh/babel');
	}

	return {
		presets: [
			'@babel/preset-env',
			'@babel/preset-react',
			'@babel/preset-typescript',
		],
	};
};
