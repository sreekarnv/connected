import { useMutation } from '@tanstack/react-query';
import React from 'react';
import axios from '../../shared/config/axios';

const useLikePostMutation = (
	postId: string,
	{ onSuccess }: { onSuccess: (data: any) => any }
) => {
	const result = useMutation(
		async () => {
			const res = await axios({
				url: `/posts/${postId}/like`,
				method: 'patch',
			});
			return res.data;
		},
		{
			onSuccess,
		}
	);

	return result;
};

export default useLikePostMutation;
