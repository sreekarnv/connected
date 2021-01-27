import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../store/context/AuthContext';

const Logout: React.FC = () => {
	const { user, logoutUser } = useContext(AuthContext);
	const history = useHistory();

	useEffect(() => {
		if (user) {
			logoutUser();
			return history.replace('/');
		}
	}, [logoutUser, user, history]);

	return <div>Loading....</div>;
};

export default Logout;
