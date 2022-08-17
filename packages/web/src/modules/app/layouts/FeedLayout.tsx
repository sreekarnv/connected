import { ChevronDownIcon } from '@chakra-ui/icons';
import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	Text,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	useDisclosure,
	Grid,
	GridItem,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'gatsby';
import React from 'react';
import Logo from '../../shared/components/Logo';
import ThemeToggler from '../../shared/components/ThemeToggler';
import { UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';
import FeedLinkItem from '../components/FeedLinkItem';
import UserProfileCard from '../components/UserProfileCard';

interface FeedLayoutProps {
	children: React.ReactNode;
}

const FeedLayout: React.FC<FeedLayoutProps> = ({ children }) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;
	const { isOpen } = useDisclosure();

	return (
		<>
			<Flex
				position='sticky'
				top='0'
				bgColor='gray.800'
				justifyContent='space-between'
				zIndex='banner'
				p='4'>
				<HStack>
					<Logo />
				</HStack>
				<HStack as='ul' listStyleType={'none'} spacing={8}>
					<HStack>
						<Avatar src={user.photo?.url} name={user.name} />
						<Text fontWeight='semibold'>{user.name}</Text>
					</HStack>

					<Box as='li'>
						<ThemeToggler />
					</Box>
				</HStack>
			</Flex>

			<Grid
				templateColumns={
					'1.2rem [content-start] repeat(12, [col-start] 1fr [col-end]) [content-end] 1.2rem'
				}>
				<GridItem gridColumn={'content-start / col-end 2'}>
					<Box position={'sticky'} zIndex='sticky' top='24'>
						<FeedLinkItem color='purple' name='My Feed' to='/app/feed' />
						<FeedLinkItem name='Create Post' to='/app/posts/new' />
					</Box>
				</GridItem>
				<GridItem gridColumn={'col-start 4 / col-end 9'}>
					<Box pt='7'>{children}</Box>
				</GridItem>
				<GridItem py='4' gridColumn={'col-start 11 / content-end'}>
					<Box width='100%' position={'sticky'} zIndex='sticky' top='24'>
						<UserProfileCard />
					</Box>
				</GridItem>
			</Grid>
		</>
	);
};

export default FeedLayout;
