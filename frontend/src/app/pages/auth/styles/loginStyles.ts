import bgImage from './../../../../assets/images/login.svg';

export const loginContainer = {
	bgImage: `url(${bgImage})`,
	bgRepeat: 'no-repeat',
	bgPos: {
		xl: 'right 15rem',
		md: 'right auto',
		sm: 'center 50vh',
	},
	bgSize: {
		xl: 'auto',
		md: '40rem',
		sm: '25rem',
	},
	minH: '91vh',
	templateColumns: 'repeat(12, 1fr)',
	templateRows: 'repeat(2, 1fr)',
};

export const loginformContainer = {
	rowStart: {
		base: 1,
	},
	rowEnd: {
		xl: -1,
		sm: 2,
	},
	colStart: {
		base: 2,
	},
	colEnd: {
		xl: 6,
		md: 8,
		sm: 12,
	},
	alignSelf: 'center',
};

export const loginHeading = {
	fontSize: '3.5rem',
	fontWeight: 400,
	mb: '2rem',
};

export const loginBtn = {
	colorScheme: 'primary',
	variant: 'outline',
	mt: 5,
	borderRadius: 4,
};
