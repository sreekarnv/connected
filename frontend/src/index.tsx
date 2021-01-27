import React from 'react';
import ReactDOM from 'react-dom';
import './scss/main.scss';

import App from './app/App';
import { ColorModeScript } from '@chakra-ui/react';

const app: JSX.Element = (
	<React.StrictMode>
		<ColorModeScript initialColorMode='light' />
		<App />
	</React.StrictMode>
);

ReactDOM.render(app, document.getElementById('root'));
