import { Divider, Grid, VStack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { UIContext } from '../../store/context/UiContext';

import PublicImage from './../../../assets/images/sidebar/public.svg';
import SidebarItem from './components/Nav/SidebarNavItem';

const RightSidebar = () => {
	const { onCreateGroupOpen, onCreatePostOpen } = useContext(UIContext);

	return (
		<Grid
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
			className='hide-scrollbar'
			borderRadius='50px'
			boxShadow='0 2px 30px rgba(51, 153, 255, .7)'>
			<VStack spacing={1} w='100%' h='100%'>
				<SidebarItem
					as='div'
					heading='Create Group'
					bg='purple.400'
					image={PublicImage}
					onClick={() => {
						onCreateGroupOpen();
					}}
				/>

				<SidebarItem
					heading='Post Now!'
					as='div'
					bg='primary.500'
					image={PublicImage}
					onClick={() => {
						onCreatePostOpen();
					}}
				/>

				<Divider />

				<SidebarItem
					heading='Find Friends'
					bg='primary.500'
					image={PublicImage}
					exact
					to='/app/find-friends'
				/>

				<SidebarItem
					heading='Find Groups'
					bg='secondary.500'
					image={PublicImage}
					exact
					to='/app/find-groups'
				/>
			</VStack>
		</Grid>
	);
};

export default RightSidebar;
