import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
	ChakraProvider,
	useDisclosure,
	useMediaQuery,
	Text,
} from '@chakra-ui/react';

import theme from './config/themeConfig';

import UIContextProvider from './store/context/UiContext';
import SearchContextProvider from './store/context/SearchContext';
import NotificationContextProvider from './store/context/NotificationContext';

import Loader from './components/Spinner/Spinner';

const Notifications = React.lazy(
	() => import('./pages/notifications/Notifications')
);

const CreatePost = React.lazy(
	() => import('./pages/app/containers/CreatePost')
);

const CreateGroup = React.lazy(
	() => import('./pages/app/containers/CreateGroup')
);

const Navigation = React.lazy(() => import('./layout/Navigation/Navigation'));
const Body = React.lazy(() => import('./layout/Body/Body'));
const Footer = React.lazy(() => import('./layout/Footer/Footer'));

const App: React.FC = () => {
	const { isOpen, onClose } = useDisclosure();
	const [moreThan300] = useMediaQuery('(min-width: 320px)');

	return (
		<>
			{moreThan300 ? (
				<BrowserRouter>
					<NotificationContextProvider>
						<SearchContextProvider>
							<ChakraProvider theme={theme}>
								<UIContextProvider>
									<Suspense fallback={<Loader />}>
										<Notifications isOpen={isOpen} onClose={onClose} />
										<CreatePost />
										<CreateGroup />
										<Navigation />
										<Body />
										<Footer />
									</Suspense>
								</UIContextProvider>
							</ChakraProvider>
						</SearchContextProvider>
					</NotificationContextProvider>
				</BrowserRouter>
			) : (
				<Text mt={15} colorScheme='primary' textAlign='center'>
					Use a Larger screen to view this webpage
				</Text>
			)}
		</>
	);
};

export default App;
