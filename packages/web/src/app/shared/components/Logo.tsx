import * as React from 'react';
import { Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

interface LogoProps {}

const Logo: React.FC<LogoProps> = ({}) => {
	return (
		<Text
			position='relative'
			cursor='pointer'
			fontFamily='brand'
			_before={{
				content: "''",
				pos: 'absolute',
				bottom: 0,
				left: 0,
				height: '3px',
				width: '3.75rem',
				bgColor: 'primary.800',
			}}
			fontSize={'2rem'}
			as={NavLink}
			to={'/'}>
			Connected
		</Text>
	);
};

export default Logo;
