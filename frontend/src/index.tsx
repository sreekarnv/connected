import React from 'react';
import ReactDOM from 'react-dom';
import './scss/main.scss';

import App from './app/App';
import { ColorModeScript } from '@chakra-ui/react';
import AuthContextProvider from './app/store/context/AuthContext';

const app: JSX.Element = (
	<React.StrictMode>
		<AuthContextProvider>
			<ColorModeScript initialColorMode='light' />
			<App />
		</AuthContextProvider>
	</React.StrictMode>
);

ReactDOM.render(app, document.getElementById('root'));
