import Axios from 'axios';

const axios = Axios.create({
	baseURL: `${process.env.GATSBY_SERVER_URL}/api/v1/`,
	withCredentials: true,
});

export default axios;
