import * as React from 'react';
import PostContextProvider from '../context/PostContext';
import useMeQuery from '../hooks/api/users/queries/useMeQuery';

const Body = React.lazy(() => import('./Body'));
const Navigation = React.lazy(() => import('./Navigation'));

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = ({}) => {
	useMeQuery();

	return (
		<>
			<PostContextProvider>
				<Navigation />
				<Body />
			</PostContextProvider>
		</>
	);
};

export default Layout;
