import { useQuery } from 'react-query';
import axios from '../../../../../lib/axios';

const useMeQuery = () => {
	const { data, error, isLoading, isFetching } = useQuery('me', async () => {
		const res = await axios({
			method: 'GET',
			url: '/api/users/me',
		});

		return res.data.user;
	});

	return { data, error, isLoading, isFetching };
};

export default useMeQuery;
