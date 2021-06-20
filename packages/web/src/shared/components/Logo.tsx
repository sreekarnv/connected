import * as React from 'react';
import { Text } from '@chakra-ui/react';
import NextLink from 'next/link';

interface LogoProps {}

const Logo: React.FC<LogoProps> = ({}) => {
	return (
		<NextLink href='/'>
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
				fontSize={'2rem'}>
				Connected
			</Text>
		</NextLink>
	);
};

export default Logo;
