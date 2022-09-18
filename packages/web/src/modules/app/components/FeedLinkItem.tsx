import { Box, Flex, Image, Text, useColorMode } from '@chakra-ui/react';
import { Link } from 'gatsby';
import React from 'react';

const darkColors = {
	blue: 'blue.600',
	purple: 'purple.600',
	facebook: 'facebook.600',
};

const lightColors = {
	blue: 'blue.400',
	purple: 'purple.400',
	facebook: 'facebook.300',
};

interface FeedLinkItemProps {
	name: string;
	to: string;
	color?: keyof typeof lightColors;
	src?: string;
}

const FeedLinkItem: React.FC<FeedLinkItemProps> = ({
	name,
	to,
	color = 'blue',
	src,
}) => {
	const { colorMode } = useColorMode();

	return (
		<>
			<Flex
				as={Link}
				to={to}
				role='link'
				gap={4}
				alignItems='center'
				bgColor={colorMode === 'light' ? lightColors[color] : darkColors[color]}
				cursor='pointer'
				py='4'
				px='2'
				borderRadius={'3xl'}
				transition='all 0.2s ease-in-out'
				transform='translateY(0)'
				_notLast={{
					marginBottom: '8',
				}}
				_hover={{
					boxShadow(theme) {
						return `0 0 10px 5px ${theme.colors.blue[300]}`;
					},
					transform: 'translateY(-3px)',
				}}>
				<Image boxSize='40%' src={src} />
				<Text fontSize={'2xl'} fontWeight='semibold'>
					{name}
				</Text>
			</Flex>
		</>
	);
};

export default FeedLinkItem;
