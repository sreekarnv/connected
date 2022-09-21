import { IconButton, IconButtonProps, ResponsiveValue } from '@chakra-ui/react';
import { Link } from 'gatsby';
import React from 'react';

interface MobileMenuNavIconLinkProps {
	icon: IconButtonProps['icon'];
	label: string;
	to?: string;
	colorScheme: IconButtonProps['colorScheme'];
	onClick?: () => void;
	display?: IconButtonProps['display'];
}

const MobileMenuNavIconLink: React.FC<MobileMenuNavIconLinkProps> = ({
	label,
	to,
	display = { base: 'none', md: 'flex' },
	...props
}) => {
	if (to) {
		return (
			<IconButton
				as={Link}
				display={display}
				size='lg'
				borderRadius='full'
				aria-label={label}
				variant='outline'
				to={to}
				{...props}
			/>
		);
	}

	return (
		<IconButton
			display={display}
			size='lg'
			borderRadius='full'
			aria-label={label}
			variant='outline'
			{...props}
		/>
	);
};
export default MobileMenuNavIconLink;
