import { Box, Heading, useTheme, VStack } from '@chakra-ui/react';
import * as React from 'react';
import { Theme } from '../../lib/theme';
import { PostContext } from '../shared/context/PostContext';
import SideDrawerItem from './SideDrawerItem';

interface FeedSidebarProps {}

const FeedSidebar: React.FC<FeedSidebarProps> = ({}) => {
	const { onCreatePostOpen } = React.useContext(PostContext);
	const theme = useTheme<Theme>();

	return (
		<>
			<VStack
				boxShadow={`0px 0.5rem 2rem ${theme.colors.primary['600']}`}
				bg='gray.800'
				p='10'
				h='85%'
				borderRadius='80px'>
				<SideDrawerItem name='Public' image='public' href='/feed' />
				<SideDrawerItem
					color='purple'
					name='Create Post'
					image='group'
					onClick={() => onCreatePostOpen()}
				/>
			</VStack>
		</>
	);
};

export default FeedSidebar;
