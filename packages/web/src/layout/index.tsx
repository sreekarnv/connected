import * as React from 'react';
import useMeQuery from '../hooks/api/users/queries/useMeQuery';

const Body = React.lazy(() => import('./Body'));
const Navigation = React.lazy(() => import('./Navigation'));

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = ({}) => {
	useMeQuery();

	return (
		<>
			<Navigation />
			<Body />
		</>
	);
};

export default Layout;
