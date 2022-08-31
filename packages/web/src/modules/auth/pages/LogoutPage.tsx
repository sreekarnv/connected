import React from 'react';
import Loader from '../../shared/components/Loader';
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
			<Loader height='70vh' />
		</>
	);
};

export default LogoutPage;
