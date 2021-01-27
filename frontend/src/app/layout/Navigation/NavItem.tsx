import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Button, MenuItem } from '@chakra-ui/react';

interface Props {
	to: string;
	children: string;
	menu?: boolean;
	exact?: boolean;
	color?: string;
	logout?: boolean | undefined;
	onClose?: () => void;
}

const NavItem: React.FC<Props> = (props) => {
	const { exact, children, to, color, logout, onClose, menu } = props;

	if (menu) {
		return (
			<MenuItem
				color={color || logout ? 'red.600' : ''}
				fontSize='inherit'
				textTransform='uppercase'
				as={NavLink}
				exact={exact}
				_activeLink={{
					color: 'primary.700',
				}}
				to={to}
				d='block'
				w='100%'>
				{children}
			</MenuItem>
		);
	}

	return (
		<Box display='inline-block' as='li'>
			<Button
				onClick={onClose}
				bg='transparent'
				size='sm'
				outline='none'
				textTransform='uppercase'
				_hover={{
					bg: 'transparent',
					color: 'primary',
				}}
				_focus={{
					outline: 'none',
				}}
				_active={{
					bg: 'transparent',
				}}
				activeClassName='navbar--active'
				exact={exact}
				to={to}
				as={NavLink}>
				{children}
			</Button>
		</Box>
	);
};

export default NavItem;
