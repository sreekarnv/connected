import { useState } from 'react';

const useSpinner = (initialSpinnerValue: boolean = false) => {
	const [showSpinner, setShowSpinner] = useState(initialSpinnerValue);

	const loadSpinner = () => setShowSpinner(true);

	const closeSpinner = () => setShowSpinner(false);

	return { showSpinner, loadSpinner, closeSpinner };
};

export default useSpinner;
