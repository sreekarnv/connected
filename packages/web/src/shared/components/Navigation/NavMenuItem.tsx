import { MenuItem } from '@chakra-ui/react';
import * as React from 'react';
import NextLink from 'next/link';

interface NavMenuItemProps {
	href: string;
	children: string;
	color?: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const NavMenuItem: React.FC<NavMenuItemProps> = ({
	color,
	href,
	children,
	onClick,
}) => {
	return (
		<NextLink href={href}>
			<MenuItem
				as='a'
				onClick={onClick}
				color={color || 'default'}
				fontSize='inherit'
				textTransform='uppercase'
				_activeLink={{
					color: 'primary.700',
				}}
				d='block'
				w='100%'>
				{children}
			</MenuItem>
		</NextLink>
	);
};

export default NavMenuItem;
