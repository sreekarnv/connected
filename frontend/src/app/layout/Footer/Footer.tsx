import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

import { Box, Text } from '@chakra-ui/react';
import { AuthContext } from '../../store/context/AuthContext';

const Footer: React.FC = () => {
	const { user } = useContext(AuthContext);

	return ReactDOM.createPortal(
		<Box position='absolute' bottom={0} right={0} textAlign='center' p={5}>
			{!user && (
				<Text fontSize={'1.05rem'} textTransform='capitalize' color='GrayText'>
					Copyright by &copy; Sreekar Venkata Nutulapati
				</Text>
			)}
		</Box>,
		document.getElementById('footer-wrapper')!
	);
};

export default Footer;
