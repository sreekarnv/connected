import {
	Box,
	Flex,
	Heading,
	HStack,
	IconButton,
	Tooltip,
	Text,
} from '@chakra-ui/react';
import { Group as GroupType } from '../../../config/types';

import { ReactComponent as JoinRequestIcon } from './../../../../assets/icons/message.svg';
// import { ReactComponent as GroupsIcon } from './../../../../assets/icons/groups.svg';
import axios from 'axios';
import Spinner from './../../../components/Spinner/Spinner';
import { useContext, useState } from 'react';
import { SearchContext } from '../../../store/context/SearchContext';

import styles from './groupItemStyles';

interface Props {
	group: GroupType;
}

const GroupItem: React.FC<Props> = (props) => {
	const { group } = props;
	const { updateGroups } = useContext(SearchContext);
	const [loading, setLoading] = useState(false);

	const sendGroupRequest = async () => {
		setLoading(true);
		try {
			await axios({
				url: `api/v1/groups/${group._id}/sendGroupJoinRequest`,
				method: 'GET',
			});

			updateGroups(group._id);
		} catch (err) {}
		setLoading(false);
	};

	return (
		<Flex {...styles.container}>
			<Flex {...styles.textContainer}>
				<Heading {...styles.textContainerName}>{group.name}</Heading>
				<Text color='#fff'>
					<Box as='span'>{group && group.members && group.members.length}</Box>
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
					{loading ? (
						<IconButton
							color='green.600'
							bg='gray.700'
							hover={{
								bg: 'gray.700',
							}}
							active={{
								bg: 'gray.700',
							}}
							size='sm'
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
				{/* <Tooltip
					hasArrow
					placement='right-start'
					label='show group info'
					{...styles.btnTooltip}>
					<IconButton
						{...styles.btn}
						aria-label='show group info'
						icon={<GroupsIcon fill='#fff' />}
					/>
				</Tooltip> */}
			</HStack>
		</Flex>
	);
};

export default GroupItem;
