import { Box } from '@chakra-ui/react';
import React from 'react';

interface HiddenProps {
	hide: {
		sm?: boolean;
		md?: boolean;
		lg?: boolean;
		xl?: boolean;
	};
	w?: string | number;
	children: any;
}

const Hidden: React.FC<HiddenProps> = ({ hide, children, w }) => {
	return (
		<Box
			w={w}
			display={{
				sm: hide.sm ? 'none' : 'block',
				md: hide.md ? 'none' : 'block',
				lg: hide.lg ? 'none' : 'block',
				xl: hide.xl ? 'none' : 'block',
			}}>
			{children}
		</Box>
	);
};

export default Hidden;
