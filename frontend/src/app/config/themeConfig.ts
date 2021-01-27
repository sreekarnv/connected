import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const fonts = {
	body: 'Lato, sans-serif',
	brand: 'GrinchedRegular, sans-serif ',
};

const colors = {
	primary: {
		50: '#add6ff',
		100: '#85c2ff',
		200: '#5cadff',
		300: '#47a3ff',
		400: '#3399ff',
		500: '#1e90ff',
		600: '#0a85ff',
		700: '#007af5',
		800: '#0070e0',
		900: '#0066cc',
	},

	secondary: {
		50: '#fff',
		100: '#ecf1fe',
		200: '#d8e3fd',
		300: '#c5d5fc',
		400: '#adc4fb',
		500: '#9eb9fa',
		600: '#8aacf9',
		700: '#779ef9',
		800: '#6390f8',
		900: '#5082f7',
	},

	// secondary: '#adc4fb',
	tertiary: '#e3f0ff',
};

const breakpoints = createBreakpoints({
	xs: '300px',
	sm: '320px',
	md: '768px',
	lg: '960px',
	xl: '1200px',
	'1778px': '1778px',
});

const config = {
	initialColorMode: 'light',
	useSystemColorMode: false,
};

const theme = extendTheme({ fonts, colors, breakpoints, config });

export default theme;
