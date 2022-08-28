import {
	ArrowRightIcon,
	ExternalLinkIcon,
	ViewIcon,
	ViewOffIcon,
} from '@chakra-ui/icons';
import {
	Avatar,
	Badge,
	Box,
	Button,
	Collapse,
	Flex,
	HStack,
	IconButton,
	Link,
	Text,
	Tooltip,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import React from 'react';
import { GroupType, NotifType, UserType } from '../../shared/types/api';

interface FindFriendItemProps {
	user: UserType;
}

const FindFriendItem: React.FC<FindFriendItemProps> = ({ user }) => {
	return (
		<>
			<Flex
				flexDir={'column'}
				justifyContent='space-between'
				bg='gray.900'
				p='4'
				transition={'all 0.2s ease-in-out'}
				_hover={{
					// @ts-ignore
					boxShadow: (theme) => `0 0 10px 5px ${theme.colors.blue[600]}`,
				}}
				mb='4'
				borderRadius='xl'>
				<VStack spacing={5}>
					<Avatar size='lg' src={user.photo?.url} name={user.name} />
					<Box textAlign='center'>
						<Text
							mb='2'
							textAlign='center'
							fontWeight={'semibold'}
							fontSize='xl'>
							{user.name}
						</Text>
						<Link href={`mailto:${user.email}`} color='blue.500'>
							{user.email}
						</Link>
					</Box>
				</VStack>

				<HStack mt='10'>
					<Button variant='outline' colorScheme='green'>
						Send Friend Request
					</Button>
					<Tooltip aria-label='View Profile' label='View Profile'>
						<IconButton
							colorScheme='purple'
							variant='outline'
							aria-label='View Profile'
							icon={<ViewIcon fontSize={20} />}
						/>
					</Tooltip>
				</HStack>
			</Flex>
		</>
	);
};

export default FindFriendItem;
