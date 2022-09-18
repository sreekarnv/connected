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
	Collapse,
	Flex,
	HStack,
	IconButton,
	Text,
	Tooltip,
	useColorMode,
	useDisclosure,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'gatsby';
import React from 'react';
import { socket } from '../../shared/providers/AppProvider';
import { GroupType, NotifType, UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';

interface FindGroupItemProps {
	group: GroupType;
}

const FindGroupItem: React.FC<FindGroupItemProps> = ({ group }) => {
	const { isOpen, onToggle } = useDisclosure();
	const { colorMode } = useColorMode();
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;
	const requestSent = group.requests.includes(user._id);

	return (
		<>
			<Box
				bg={colorMode === 'light' ? 'gray.300' : 'gray.900'}
				p='4'
				mb='4'
				borderRadius='xl'>
				<Flex alignItems='center' justifyContent='space-between'>
					<Flex alignItems='center' gap='5'>
						<Avatar src={group.photo?.url} name={group.name} />
						<Text fontWeight={'bold'} fontSize='2xl'>
							{group.name}
						</Text>
					</Flex>
					<Badge
						variant='solid'
						colorScheme={group.groupType === 'private' ? 'purple' : 'teal'}>
						{group.groupType}
					</Badge>
				</Flex>

				<Collapse in={isOpen}>
					<Text mt='4'>{group.description}</Text>
				</Collapse>

				<Flex justifyContent='space-between' mt='8'>
					<HStack>
						<Avatar
							size='xs'
							src={group.admin.photo?.url}
							name={group.admin.name}
						/>
						<Text fontWeight='semibold'>{group.admin.name}</Text>
					</HStack>

					<HStack>
						<Tooltip
							placement='top'
							hasArrow
							label={isOpen ? 'Hide Details' : 'View Details'}>
							<IconButton
								colorScheme={isOpen ? 'red' : 'gray'}
								aria-label='toggle collapse group details'
								icon={isOpen ? <ViewOffIcon /> : <ViewIcon />}
								onClick={onToggle}
								variant={isOpen ? 'solid' : 'outline'}
							/>
						</Tooltip>

						{group.groupType === 'public' ||
							(group.members.includes(user._id) && (
								<Tooltip placement='top' hasArrow label='View Group Profile'>
									<IconButton
										as={Link}
										to={`/app/groups/${group._id}`}
										aria-label='view group'
										icon={<ExternalLinkIcon />}
										variant='outline'
									/>
								</Tooltip>
							))}

						{group.groupType === 'private' &&
							!group.members.includes(user._id) && (
								<Tooltip
									placement='top'
									hasArrow
									label={
										requestSent
											? 'You have already requested'
											: 'Send request to join the group'
									}>
									<IconButton
										onClick={() => {
											if (!requestSent) {
												socket.emit(NotifType.JOIN_GROUP_REQUEST_SENT, {
													group: { _id: group._id, name: group.name },
													user: queryClient.getQueryData([
														RQ.LOGGED_IN_USER_QUERY,
													]) as UserType,
												});
											}
										}}
										cursor={requestSent ? 'default' : 'pointer'}
										aria-label='view group'
										icon={
											<ArrowRightIcon
												color={requestSent ? 'gray.600' : 'inherit'}
											/>
										}
										variant={requestSent ? 'unstyled' : 'outline'}
									/>
								</Tooltip>
							)}
					</HStack>
				</Flex>
			</Box>
		</>
	);
};

export default FindGroupItem;
