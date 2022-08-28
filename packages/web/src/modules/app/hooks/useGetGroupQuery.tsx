import { useQuery } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';

const useGetGroupQuery = (id: string) => {
	const result = useQuery(
		[RQ.GET_GROUP_QUERY, id],
		async () => {
			const res = await axios({
				url: `/groups/${id}`,
				method: 'get',
			});

			return res.data;
		},
		{}
	);

	return result;
};

export default useGetGroupQuery;
