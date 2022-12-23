import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { navigate } from '@reach/router';
import axios from '../../shared/config/axios';

const useJoinPublicGroupMutation = () => {
	const result = useMutation<any, any, { _id: string }>(
		async ({ _id }) => {
			const res = await axios({
				url: `/groups/join-public-group`,
				method: 'patch',
				data: {
					_id,
				},
			});

			return res.data.group;
		},
		{
			onSuccess(data) {
				console.log(data);
				navigate(`/app/groups/${data._id}`);
			},
		}
	);

	return result;
};

export default useJoinPublicGroupMutation;
