import { useMutation } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';
import { RQ } from '../../shared/types/react-query';
import { navigate } from 'gatsby';

const useCreateCommentMutation = (
	postId: string,
	{ onSuccess }: { onSuccess: (data: any) => any }
) => {
	const result = useMutation<any, any, { content: string }, any>(
		async (data) => {
			const res = await axios({
				url: `/comments?post=${postId}`,
				method: 'post',
				data,
			});
			return res.data.comment;
		},
		{
			onSuccess: (data) => {
				onSuccess(data);
			},
		}
	);

	return result;
};

export default useCreateCommentMutation;
