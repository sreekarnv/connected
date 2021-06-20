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
};

const breakpoints = createBreakpoints({
	xs: '300px',
	sm: '320px',
	md: '768px',
	lg: '960px',
	xl: '1200px',
});

const theme = extendTheme({
	fonts,
	colors,
	breakpoints,
	config: {
		initialColorMode: 'light',
		useSystemColorMode: true,
	},
});

export type Theme = typeof theme;

export default theme;
