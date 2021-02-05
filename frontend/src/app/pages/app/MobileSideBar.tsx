import React, { useContext, useState } from 'react';
import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerOverlay,
	DrawerHeader,
	Grid,
	VStack,
} from '@chakra-ui/react';

import GroupImage from './../../../assets/images/sidebar/group.svg';
import FriendImage from './../../../assets/images/sidebar/friends.svg';

import { AnimateSharedLayout, motion } from 'framer-motion';
import { AuthContext } from '../../store/context/AuthContext';

import { User as UserType } from './../../config/types';
import UserAvatar from '../../components/UserAvatar/UserAvatar';

import SidebarItem from './components/Nav/SidebarNavItem';
import Hidden from '../../components/Hidden/Hidden';

const MobileSideBar: React.FC<any> = ({ isOpen, onClose }) => {
	const { user, userGroups } = useContext(AuthContext);
	const [group, showGroup] = useState(false);
	const [friend, showFriend] = useState(false);

	return (
		<Drawer isOpen={isOpen} placement='left' onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				{user && (
					<DrawerHeader>
						<UserAvatar />
					</DrawerHeader>
				)}
				<DrawerBody p={3}>
					<Grid
						p={3}
						alignItems='start'
						overflowY='scroll'
						className='hide-scrollbar'>
						<VStack spacing={1} w='100%' h='100%'>
							<Hidden w='100%' hide={{ lg: true, md: true, xl: true }}>
								<SidebarItem
									bg='primary.700'
									exact
									to='/app/find-friends'
									heading='Find Friends'
									image={FriendImage}
									active={friend}
								/>
							</Hidden>

							<Hidden w='100%' hide={{ lg: true, md: true, xl: true }}>
								<SidebarItem
									bg='primary.700'
									exact
									to='/app/find-groups'
									heading='Find Groups'
									image={FriendImage}
									active={friend}
								/>
							</Hidden>

							<SidebarItem
								as='div'
								bg='secondary.600'
								heading='My Groups'
								image={GroupImage}
								active={group}
								subHeading={`${userGroups && userGroups.length} groups`}
								onClick={() => {
									showFriend(false);
									showGroup(!group);
								}}
							/>

							<AnimateSharedLayout type='crossfade'>
								<motion.span
									layout
									style={{ width: '90%', marginLeft: 'auto' }}>
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
														image={group.photo}
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
								subHeading={`${user && user.friends.length} friends`}
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
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};

export default MobileSideBar;
