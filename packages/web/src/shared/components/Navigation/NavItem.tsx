import { Box, Button, ColorProps, useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface NavItemProps {
	href: string;
	color?: ColorProps['color'];
}

const NavItem: React.FC<NavItemProps> = ({ children, href, color }) => {
	const { colorMode } = useColorMode();
	const router = useRouter();

	console.log(router);

	return (
		<NextLink href={href}>
			<Button
				as='a'
				bg='transparent'
				cursor='pointer'
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
				color={
					router.pathname === href
						? colorMode === 'dark'
							? 'var(--chakra-colors-primary-200)'
							: 'var(--chakra-colors-primary-800)'
						: color || 'default'
				}>
				{children}
			</Button>
		</NextLink>
	);
};

export default NavItem;
