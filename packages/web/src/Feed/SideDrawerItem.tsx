import { HStack, Heading, Box, useTheme, theme } from '@chakra-ui/react';
import * as React from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Theme } from '../../lib/theme';

interface SideDrawerItemProps {
	href?: string;
	name: string;
	image: string;
	onClick?: () => void;
	color?: string;
}

const SideDrawerItem: React.FC<SideDrawerItemProps> = ({
	href,
	name,
	image,
	onClick,
	color = 'primary',
}) => {
	const router = useRouter();
	const theme = useTheme<Theme>();

	const component = (
		<HStack
			mb='8'
			onClick={onClick}
			_hover={{
				boxShadow: `0px 0.5rem 2rem ${theme.colors[color]['600']}`,
				transform: 'scale(1.05)',
			}}
			transition='all .5s ease-out'
			transform='scale(1)'
			boxShadow={
				href
					? href === router.pathname
						? `0px 0.5rem 2rem ${theme.colors[color]['600']}`
						: 'none'
					: ''
			}
			cursor='pointer'
			w='340px'
			bgColor={`${color}.700`}
			borderRadius='3xl'>
			<Box mx='2'>
				<Image
					src={`/images/sidebar/${image}.svg`}
					height={100}
					width={120}
					alt={image}
				/>
			</Box>
			<Box>
				<Heading fontWeight='500' fontSize='2xl'>
					{name}
				</Heading>
			</Box>
		</HStack>
	);

	if (href) {
		return <NextLink href={href}>{component}</NextLink>;
	}

	return component;
};

export default SideDrawerItem;
