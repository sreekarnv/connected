import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AlertProps } from '../config/types';

const useAlert = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [alertDetails, setAlertDetails] = useState<null | AlertProps>(null);

	useEffect(() => {
		if (alertDetails) {
			const timer = setTimeout(() => {
				onClose();
			}, 2500);

			return () => clearTimeout(timer);
		}
	}, [alertDetails, onClose]);

	const setAlert = (
		status: 'error' | 'success' | 'info' | 'warning' = 'info',
		message: string
	) => {
		setAlertDetails({
			status,
			message,
		});
		onOpen();
	};

	return {
		setAlert,
		isAlertOpen: isOpen,
		onAlertClose: onClose,
		alertDetails: alertDetails,
	};
};

export default useAlert;
