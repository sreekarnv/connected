import { Box, Button, ColorProps, useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
	to: string;
	exact?: boolean;
	color?: ColorProps['color'];
}

const NavItem: React.FC<NavItemProps> = ({ children, to, exact, color }) => {
	const { colorMode } = useColorMode();
	return (
		<Box display='inline-block' as='li'>
			<Button
				bg='transparent'
				size='sm'
				outline='none'
				textTransform='uppercase'
				_hover={{
					bg: 'transparent',
					color: colorMode === 'dark' ? 'primary.200' : 'primary.800',
				}}
				_focus={{
					outline: 'none',
				}}
				_active={{
					bg: 'transparent',
				}}
				color={color || 'default'}
				activeStyle={{
					color:
						colorMode === 'dark'
							? 'var(--chakra-colors-primary-200)'
							: 'var(--chakra-colors-primary-800)',
				}}
				exact={exact}
				to={to}
				as={NavLink}>
				{children}
			</Button>
		</Box>
	);
};

export default NavItem;
