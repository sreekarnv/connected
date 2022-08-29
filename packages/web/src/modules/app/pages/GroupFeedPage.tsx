import { Avatar, Flex, HStack, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { UserType } from '../../shared/types/api';
import { RQ } from '../../shared/types/react-query';
import useGetGroupQuery from '../hooks/useGetGroupQuery';

interface GroupFeedPageProps {
	id: string;
}

const GroupFeedPage: React.FC<GroupFeedPageProps> = ({ id }) => {
	const queryClient = useQueryClient();
	const { data } = useGetGroupQuery(id);
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]) as UserType;

	return (
		<>
			<Flex alignItems={'center'} justifyContent='space-between' mb='5'>
				<HStack gap='3'>
					<Avatar size='lg' src={data?.photo.url} name={data?.name} />
					<Text fontSize='2xl' fontWeight='bold'>
						{data?.name}
					</Text>
				</HStack>

				<Text>
					Created By{' '}
					<Text as='span' fontWeight='semibold'>
						{data?.admin.name}{' '}
					</Text>
				</Text>
			</Flex>
		</>
	);
};

export default GroupFeedPage;
