import React from 'react';

const useLoading = () => {
	const [isLoading, setIsLoading] = React.useState(false);

	return {
		isLoading,
		setIsLoading,
	};
};

export default useLoading;
