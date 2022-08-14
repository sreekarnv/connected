import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RQ } from '../types/react-query';

interface BaseLayoutProps {
	children: React.ReactNode;
}

const BaseNavbar = () => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]);

	return (
		<></>
		// <AppBar
		// 	position='sticky'
		// 	elevation={0}
		// 	color='inherit'
		// 	sx={{ borderBottom: '1px solid #ddd' }}>
		// 	<Toolbar>
		// 		<Typography variant='h6'>Navbar</Typography>

		// 		<Box
		// 			sx={{
		// 				marginLeft: 'auto',
		// 				display: 'flex',
		// 				alignItems: 'center',
		// 				gap: '10px',
		// 			}}>
		// 			{!user ? (
		// 				<>
		// 					<Button
		// 						component={Link}
		// 						to='/app/auth/login'
		// 						startIcon={<LoginOutlined />}
		// 						sx={{ fontWeight: '600' }}
		// 						color='inherit'>
		// 						Log In
		// 					</Button>
		// 					<Button
		// 						component={Link}
		// 						to='/app/auth/signup'
		// 						variant='outlined'
		// 						startIcon={<AccountCircleOutlined />}
		// 						sx={{ fontWeight: '600' }}
		// 						color='inherit'>
		// 						Sign Up
		// 					</Button>
		// 				</>
		// 			) : (
		// 				<></>
		// 			)}
		// 		</Box>
		// 	</Toolbar>
		// </AppBar>
	);
};

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
	return (
		<>
			<BaseNavbar />
			<main>{children}</main>
		</>
	);
};

export default BaseLayout;
