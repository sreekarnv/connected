import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { Link } from 'gatsby';
import React from 'react';

interface MobileMenuNavIconLinkProps {
	icon: IconButtonProps['icon'];
	label: string;
	to?: string;
	colorScheme: IconButtonProps['colorScheme'];
	onClick?: () => void;
}

const MobileMenuNavIconLink: React.FC<MobileMenuNavIconLinkProps> = ({
	label,
	to,
	...props
}) => {
	if (to) {
		return (
			<IconButton
				as={Link}
				display={{ base: 'none', md: 'flex' }}
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
			display={{ base: 'none', md: 'flex' }}
			size='lg'
			borderRadius='full'
			aria-label={label}
			variant='outline'
			{...props}
		/>
	);
};
export default MobileMenuNavIconLink;
