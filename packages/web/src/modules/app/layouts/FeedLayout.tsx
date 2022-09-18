import { Box, Grid, GridItem, useColorMode } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import AppNavbar from '../../shared/layouts/navigation/AppNavbar';
import { UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';
import FeedLinkItem from '../components/FeedLinkItem';

import PublicFeedImage from './../../../images/home.svg';
import CreateGroupImage from './../../../images/create-group.svg';
import FindGroupsImage from './../../../images/find-groups.svg';
import FindFriendsImage from './../../../images/find-friends.svg';
import MyGroupsImage from './../../../images/my-groups.svg';
import PostsImage from './../../../images/posts.svg';
import MyFriendsImage from './../../../images/my-friends.svg';

interface FeedLayoutProps {
	children: React.ReactNode;
}

const FeedLayout: React.FC<FeedLayoutProps> = ({ children }) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;
	const { colorMode } = useColorMode();

	if (!user) return <>{children}</>;

	return (
		<>
			<AppNavbar />
			<Grid
				templateColumns={{
					base: '1rem [content-start] 1fr [content-end] 1rem',
					lg: '.01rem [content-start] repeat(14, [col-start] 1fr [col-end]) [content-end] .01rem',
					'2xl':
						'1.2rem [content-start] repeat(14, [col-start] 1fr [col-end]) [content-end] 1.2rem',
				}}
				columnGap={{ lg: 4, xl: 6, '2xl': 0 }}>
				<GridItem
					display={{
						base: 'none',
						lg: 'block',
					}}
					height='100%'
					gridColumn={{
						'2xl': 'content-start / col-end 3',
						xl: 'content-start / col-end 4',
						lg: 'content-start / col-end 5',
					}}>
					<Box
						position={'sticky'}
						zIndex='sticky'
						borderRadius='50px'
						top={'88px'}
						p='8'
						mt='4'
						height='calc(96vh - 72px)'
						// @ts-ignore
						boxShadow={(theme) =>
							`0 0 10px 5px ${
								colorMode === 'light'
									? theme.colors.blue[300]
									: theme.colors.blue[600]
							}`
						}>
						{' '}
						<FeedLinkItem
							src={PublicFeedImage}
							color='purple'
							name='Public Feed'
							to='/app/feed'
						/>
						<FeedLinkItem
							src={PostsImage}
							name='Create Post'
							to='/app/posts/new'
						/>
						<FeedLinkItem
							src={CreateGroupImage}
							color='facebook'
							name='Create Group'
							to='/app/groups/new'
						/>
					</Box>
				</GridItem>
				<GridItem
					gridColumn={{
						base: 'content-start / content-end',
						lg: 'col-start 6 / content-end',
						xl: 'col-start 5 / col-end 10',
					}}>
					<Box pt={{ base: '4' }}>{children}</Box>
				</GridItem>
				<GridItem
					display={{
						base: 'none',
						xl: 'block',
					}}
					gridColumn={{
						'2xl': 'col-start 12 / content-end',
						xl: 'col-start 11 / content-end',
					}}>
					<Box
						width='100%'
						top={'88px'}
						p='8'
						mt='4'
						height='calc(96vh - 72px)'
						position={'sticky'}
						zIndex='sticky'
						borderRadius='50px'
						// @ts-ignore
						boxShadow={(theme) =>
							`0 0 10px 5px ${
								colorMode === 'light'
									? theme.colors.blue[300]
									: theme.colors.blue[600]
							}`
						}>
						<FeedLinkItem
							src={FindGroupsImage}
							name='Find Groups'
							to='/app/groups/find'
						/>
						<FeedLinkItem
							src={FindFriendsImage}
							color='facebook'
							name='Find Friends'
							to='/app/friends/find'
						/>

						<FeedLinkItem
							src={MyFriendsImage}
							color='purple'
							name='My Friends'
							to='/app/friends/me'
						/>

						<FeedLinkItem
							src={MyGroupsImage}
							color='blue'
							name='My Groups'
							to='/app/groups/me'
						/>
					</Box>
				</GridItem>
			</Grid>
		</>
	);
};

export default FeedLayout;
