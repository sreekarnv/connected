import bgImage from './../../../../assets/images/register.svg';

export const registerContainer = {
	bgImage: `url(${bgImage})`,
	bgRepeat: 'no-repeat',
	bgPos: {
		xl: 'left 15rem',
		md: 'left auto',
		sm: 'center 70vh',
	},
	bgSize: {
		xl: '40rem',
		md: '30rem',
		sm: '25rem',
	},
	minH: '91vh',
	templateColumns: 'repeat(12, 1fr)',
	templateRows: '1fr .5fr',
};

export const registerformContainer = {
	rowStart: {
		base: 1,
	},
	rowEnd: {
		xl: -1,
		sm: 2,
	},
	colStart: {
		xl: 7,
		sm: 2,
	},
	colEnd: {
		xl: 11,
		md: 8,
		sm: 12,
	},
	alignSelf: 'center',
};

export const registerHeading = {
	fontSize: '3.5rem',
	fontWeight: 400,
	mb: '2rem',
};

export const registerBtn = {
	colorScheme: 'primary',
	variant: 'outline',
	mt: 5,
	borderRadius: 4,
};
