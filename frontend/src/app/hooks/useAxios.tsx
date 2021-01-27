import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

const useAxios: (
	url: string,
	method?: 'get' | 'post' | 'patch' | 'delete',
	data?: any
) => { loading: boolean; serverData: any; error: any } = (
	url,
	method = 'get',
	data
) => {
	const [loading, setLoading] = useState(false);
	const [serverData, setServerData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getData = async () => {
			setLoading(true);
			try {
				const res: AxiosResponse = await axios({
					method,
					url,
					data,
				});

				setServerData(res.data);
			} catch (err) {
				setError(error);
			}
			setLoading(false);
		};

		getData();
	}, [method, url, data, error]);

	return { loading, serverData, error };
};

export default useAxios;
