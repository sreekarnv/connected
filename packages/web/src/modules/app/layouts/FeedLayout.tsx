import { Box, Grid, GridItem } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import AppNavbar from '../../shared/layouts/navigation/AppNavbar';
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
						top='24'
						p='8'
						mt='4'
						height='calc(90vh - 24px)'
						// @ts-ignore
						boxShadow={(theme) => `0 0 10px 5px ${theme.colors.blue[600]}`}>
						{' '}
						<FeedLinkItem color='purple' name='My Feed' to='/app/feed' />
						<FeedLinkItem name='Create Post' to='/app/posts/new' />
						<FeedLinkItem
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
					py='4'
					pl='8'
					display={{
						base: 'none',
						xl: 'block',
					}}
					gridColumn={{
						'2xl': 'col-start 12 / content-end',
						xl: 'col-start 11 / content-end',
					}}>
					<Box width='100%' position={'sticky'} zIndex='sticky' top='24'>
						<UserProfileCard />
						<Box mt='8'>
							<FeedLinkItem name='Find Groups' to='/app/groups/find' />
							<FeedLinkItem
								color='purple'
								name='Find Friends'
								to='/app/friends/find'
							/>
						</Box>
					</Box>
				</GridItem>
			</Grid>
		</>
	);
};

export default FeedLayout;
