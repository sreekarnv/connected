import React from 'react';
import useLogoutMutation from '../hooks/useLogoutMutation';

interface LogoutPageProps {
	path?: string;
}

const LogoutPage: React.FC<LogoutPageProps> = ({}) => {
	const { mutate } = useLogoutMutation();

	React.useEffect(() => {
		mutate();
	}, []);

	return (
		<>
			<h1>Logout Loading...</h1>
		</>
	);
};

export default LogoutPage;
