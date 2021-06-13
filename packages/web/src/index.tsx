import '@babel/polyfill';
import * as React from 'react';
import { render } from 'react-dom';
import App from './App';

import './main.scss';

const app = (
	<React.StrictMode>
		<App />
	</React.StrictMode>
);

render(app, document.getElementById('app'));
