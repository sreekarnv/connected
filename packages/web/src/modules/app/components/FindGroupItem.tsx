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
	useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'gatsby';
import React from 'react';
import { GroupType } from '../../shared/types/api';

interface FindGroupItemProps {
	group: GroupType;
}

const FindGroupItem: React.FC<FindGroupItemProps> = ({ group }) => {
	const { isOpen, onToggle } = useDisclosure();

	return (
		<>
			<Box bg='gray.900' p='4' mb='4' borderRadius='xl'>
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

						{group.groupType === 'public' && (
							<Tooltip placement='top' hasArrow label='View Group Profile'>
								<IconButton
									as={Link}
									to={`/app/groups/${group._id}`}
									aria-label='view group'
									icon={<ExternalLinkIcon />}
									variant='outline'
								/>
							</Tooltip>
						)}

						{group.groupType === 'private' && (
							<Tooltip
								placement='top'
								hasArrow
								label='Send request to join the group'>
								<IconButton
									as={Link}
									to={`/app/groups/${group._id}`}
									aria-label='view group'
									icon={<ArrowRightIcon />}
									variant='outline'
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
