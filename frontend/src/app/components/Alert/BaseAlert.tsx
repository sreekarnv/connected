import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';
import React from 'react';
import { AlertProps } from './../../config/types';

interface Props {
	alertDetails: AlertProps | null;
}

const BaseAlert: React.FC<Props> = ({ alertDetails }) => {
	return (
		<Alert
			variant='solid'
			borderRadius='2px'
			pos='absolute'
			top='20%'
			left='38%'
			maxW='500px'
			status={alertDetails?.status}>
			<AlertIcon />
			<AlertTitle>{alertDetails?.message}</AlertTitle>
		</Alert>
	);
};

export default BaseAlert;
