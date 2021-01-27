import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';

import theme from './config/themeConfig';

import Navigation from './layout/Navigation/Navigation';
import Body from './layout/Body/Body';
import Footer from './layout/Footer/Footer';
import AuthContextProvider from './store/context/AuthContext';
import UIContextProvider from './store/context/UiContext';
import SearchContextProvider from './store/context/SearchContext';
import Notifications from './pages/notifications/Notifications';
import NotificationContextProvider from './store/context/NotificationContext';
import CreatePost from './pages/app/containers/CreatePost';
import CreateGroup from './pages/app/containers/CreateGroup';

const App: React.FC = () => {
	const { isOpen, onClose } = useDisclosure();

	return (
		<BrowserRouter>
			<AuthContextProvider>
				<NotificationContextProvider>
					<SearchContextProvider>
						<ChakraProvider theme={theme}>
							<UIContextProvider>
								<Notifications isOpen={isOpen} onClose={onClose} />
								<CreatePost />
								<CreateGroup />
								<Navigation />
								<Body />
								<Footer />
							</UIContextProvider>
						</ChakraProvider>
					</SearchContextProvider>
				</NotificationContextProvider>
			</AuthContextProvider>
		</BrowserRouter>
	);
};

export default App;
