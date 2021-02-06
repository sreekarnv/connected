import {
	Box,
	Flex,
	Heading,
	HStack,
	IconButton,
	Tooltip,
	Text,
	Spinner,
} from '@chakra-ui/react';
import { Group as GroupType } from '../../../config/types';

import { ReactComponent as JoinRequestIcon } from './../../../../assets/icons/message.svg';
// import { ReactComponent as GroupsIcon } from './../../../../assets/icons/groups.svg';
import axios from 'axios';
import { useContext, useState } from 'react';
import { SearchContext } from '../../../store/context/SearchContext';

import styles from './groupItemStyles';
import { AuthContext } from '../../../store/context/AuthContext';

interface Props {
	group: GroupType;
}

const GroupItem: React.FC<Props> = (props) => {
	const { group } = props;
	const { user } = useContext(AuthContext);
	const { updateGroupRequest } = useContext(SearchContext);
	const [loading, setLoading] = useState(false);

	const sendGroupRequest = async () => {
		setLoading(true);
		try {
			await axios({
				url: `api/v1/groups/${group._id}/sendGroupJoinRequest`,
				method: 'GET',
			});

			updateGroupRequest(group._id, user._id);
		} catch (err) {}
		setLoading(false);
	};

	return (
		<Flex {...styles.container}>
			<Flex {...styles.textContainer}>
				<Heading {...styles.textContainerName}>{group.name}</Heading>
				<Text color='#fff'>
					<Box as='span'>
						{group && group.members && group.members.length > 0
							? group.members.length
							: 1}
					</Box>
					<Box ml={2} as='span'>
						member(s)
					</Box>
				</Text>
			</Flex>
			<HStack spacing={8}>
				<Tooltip
					hasArrow
					placement='left-start'
					label='send group join request'
					{...styles.btnTooltip}>
					{group && group.requests && group.requests?.includes(user._id) ? (
						<Box as='p' color='yellow.300'>
							Request sent
						</Box>
					) : loading ? (
						<IconButton
							color='#fff'
							bg='primary.200'
							_hover={{
								bg: 'primary.400',
							}}
							active={{
								bg: 'primary.400',
							}}
							aria-label='accept friend request loading'
							icon={<Spinner />}
						/>
					) : (
						<IconButton
							onClick={sendGroupRequest}
							aria-label='send group join request'
							{...styles.btn}
							icon={<JoinRequestIcon fill='#fff' />}
						/>
					)}
				</Tooltip>
			</HStack>
		</Flex>
	);
};

export default GroupItem;
