import * as React from 'react';
import useMeQuery from '../../../User/hooks/api/queries/useMeQuery';
import PostContextProvider from '../../context/PostContext';
import Navigation from '../Navigation';

const Layout: React.FC<any> = ({ children }) => {
	useMeQuery();

	return (
		<>
			<PostContextProvider>
				<Navigation />
				{children}
			</PostContextProvider>
		</>
	);
};

export default Layout;
