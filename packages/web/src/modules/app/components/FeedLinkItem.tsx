import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Link } from 'gatsby';
import React from 'react';
// @ts-ignore
import SrcImage from './../../../images/home.svg';

const colors = {
	blue: 'blue.600',
	purple: 'purple.600',
	facebook: 'facebook.600',
};

interface FeedLinkItemProps {
	name: string;
	to: string;
	color?: keyof typeof colors;
}

const FeedLinkItem: React.FC<FeedLinkItemProps> = ({
	name,
	to,
	color = 'blue',
}) => {
	return (
		<>
			<Flex
				as={Link}
				to={to}
				role='link'
				gap={4}
				alignItems='center'
				bgColor={colors[color]}
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
				<Image boxSize='40%' src={SrcImage} />
				<Text fontSize={'2xl'} fontWeight='semibold'>
					{name}
				</Text>
			</Flex>
		</>
	);
};

export default FeedLinkItem;
