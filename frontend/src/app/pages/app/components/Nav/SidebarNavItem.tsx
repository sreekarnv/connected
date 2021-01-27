import { Avatar, Box, Grid, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { styles } from './styles';

interface Props {
	image?: string;
	to?: string;
	exact?: boolean;
	as?: any;
	bg?: any;
	onClick?: () => void;
	active?: boolean;
	user?: boolean;
	heading: string;
	subHeading?: string | number;
}

const SidebarItem: React.FC<Props> = ({
	to,
	image,
	exact,
	heading,
	subHeading,
	as,
	bg,
	onClick,
	active,
	user,
}) => {
	return (
		<Grid
			bg={bg}
			onClick={onClick}
			templateColumns='max-content 1fr'
			as={as || NavLink}
			exact={exact}
			to={to}
			boxShadow={active ? '0 .5rem 2rem rgba(51, 153, 255, .7)' : ''}
			transform={active ? 'scale(1.05)' : ''}
			borderRadius={20}
			{...styles}>
			{!user && (
				<Image borderRadius={20} boxSize='100px' src={image} alt={heading} />
			)}
			{user && (
				<Avatar borderRadius={20} boxSize='100px' src={image} alt='Name' />
			)}
			<Box alignSelf='center'>
				<Text fontSize='1.1rem' textTransform='uppercase'>
					{heading && heading.length > 12
						? `${heading.slice(0, 7)}...`
						: heading}
				</Text>
				<Text fontSize='.7rem' alignSelf='center'>
					{subHeading}
				</Text>
			</Box>
		</Grid>
	);
};

export default SidebarItem;
