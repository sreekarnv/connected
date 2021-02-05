import React, { useContext, useState } from 'react';
import { Grid, VStack } from '@chakra-ui/react';
import SidebarItem from './components/Nav/SidebarNavItem';

import PublicImage from './../../../assets/images/sidebar/public.svg';
import GroupImage from './../../../assets/images/sidebar/group.svg';
import FriendImage from './../../../assets/images/sidebar/friends.svg';

import { AnimateSharedLayout, motion } from 'framer-motion';
import { AuthContext } from '../../store/context/AuthContext';

import { User as UserType } from '../../config/types';

const LeftSidebar = () => {
	const { user, userGroups } = useContext(AuthContext);

	const [group, showGroup] = useState(false);
	const [friend, showFriend] = useState(false);

	return (
		<Grid
			boxShadow='0 2px 30px rgba(51, 153, 255, .7)'
			alignItems='start'
			h='88vh'
			overflowY='scroll'
			px={{
				xl: 10,
				lg: 5,
			}}
			py={{
				lg: 10,
			}}
			borderRadius='50px'
			className='hide-scrollbar'>
			<VStack spacing={1} w='100%' h='100%'>
				<SidebarItem
					heading='Public'
					exact
					bg='primary.200'
					image={PublicImage}
					to='/app/public'
					onClick={() => {
						showGroup(false);
						showFriend(false);
					}}
				/>

				<SidebarItem
					as='div'
					bg='secondary.600'
					heading='My Groups'
					subHeading={`${userGroups && userGroups.length} groups`}
					image={GroupImage}
					active={group}
					onClick={() => {
						showFriend(false);
						showGroup(!group);
					}}
				/>

				<AnimateSharedLayout type='crossfade'>
					<motion.span layout style={{ width: '90%', marginLeft: 'auto' }}>
						{group &&
							userGroups &&
							userGroups.map((group: any) => {
								return (
									<motion.span
										key={group._id}
										layout
										initial={{ opacity: 0 }}
										animate={{
											opacity: 1,
											transition: { duration: 3, ease: 'easeOut' },
										}}
										exit={{ opacity: 0 }}
										style={{ width: '80%', marginLeft: 'auto' }}>
										<SidebarItem
											exact
											bg='primary.700'
											heading={group.name}
											image={group.photo.url}
											user
											to={`/app/groups/${group._id}/${group.slug}`}
										/>
									</motion.span>
								);
							})}
					</motion.span>
				</AnimateSharedLayout>

				<SidebarItem
					bg='primary.700'
					onClick={() => {
						showGroup(false);
						showFriend(!friend);
					}}
					as='div'
					heading='My Friends'
					subHeading={`${user && user.friends && user.friends.length} friends`}
					image={FriendImage}
					active={friend}
				/>

				<motion.span layout style={{ width: '90%', marginLeft: 'auto' }}>
					{friend &&
						user &&
						user.friends.map((friend: UserType) => {
							return (
								<SidebarItem
									key={friend._id}
									bg='primary.700'
									heading={friend.firstName}
									user
									image={friend && friend.photo?.url}
									to={`/app/friends/${friend._id}`}
								/>
							);
						})}
				</motion.span>
			</VStack>
		</Grid>
	);
};

export default LeftSidebar;
