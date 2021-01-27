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
			top={{
				'1778px': '20%',
				xl: '8%',
				md: '6%',
				sm: '12%',
			}}
			m={{
				sm: '0 auto',
			}}
			zIndex='100'
			left={{
				'1778px': '38%',
				xl: '35%',
				lg: '28%',
				md: '20%',
				sm: '0%',
			}}
			maxW={{
				md: '500px',
				sm: '100%',
			}}
			status={alertDetails?.status}>
			<AlertIcon />
			<AlertTitle>{alertDetails?.message}</AlertTitle>
		</Alert>
	);
};

export default BaseAlert;
