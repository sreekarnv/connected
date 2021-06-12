import { MenuItem } from '@chakra-ui/react';
import * as React from 'react';
import { NavLink } from 'react-router-dom';

interface NavMenuItemProps {
	to: string;
	children: string;
	exact?: boolean;
	color?: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const NavMenuItem: React.FC<NavMenuItemProps> = ({
	color,
	exact,
	to,
	children,
	onClick,
}) => {
	return (
		<MenuItem
			onClick={onClick}
			color={color || 'default'}
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
};

export default NavMenuItem;
