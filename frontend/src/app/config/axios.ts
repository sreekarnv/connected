import Axios from 'axios';

const axios = Axios.create({
	url: process.env.REACT_APP_SERVER_URL,
	withCredentials: true,
});

export default axios;
