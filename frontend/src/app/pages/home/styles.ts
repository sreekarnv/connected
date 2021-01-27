import ImageBg from '../../../assets/images/home.svg';

export const Wrapper: any = {
	minH: 'calc(100vh - 6rem)',
	justifyItems: 'center',
	templateRows: {
		md: '1.2fr 1fr',
		sm: '.75fr 1fr',
	},
	templateColumns: 'repeat(12, 1fr)',
	rowGap: {
		md: '3rem',
		sm: 0,
	},
	bgImage: `url(${ImageBg})`,
	bgRepeat: 'no-repeat',
	bgSize: {
		base: '50rem auto',
		lg: '47rem auto',
		sm: '30rem auto',
	},
	bgPosition: {
		base: 'right 10rem',
		lg: 'right 14rem',
		md: 'right bottom',
		sm: 'right bottom',
	},
};

export const Heading: any = {
	textAlign: {
		md: 'left',
		sm: 'center',
	},
	justifySelf: {
		md: 'start',
		sm: 'center',
	},
	alignSelf: {
		sm: 'center',
		md: 'end',
	},
	textTransform: 'uppercase',
	rowStart: 1,
	rowEnd: 2,
	colStart: {
		md: 2,
		sm: 1,
	},
	colEnd: {
		lg: 7,
		md: -1,
		sm: -1,
	},
	mb: 5,
};

export const HeadingMain: any = {
	as: 'h1',
	mb: 3,
	fontSize: {
		sm: '3rem',
		md: '4rem',
		xl: '6rem',
	},
	fontWeight: 400,
};

export const HeadingSub: any = {
	as: 'h1',
	fontSize: {
		sm: '3rem',
		md: '5rem',
	},
	fontWeight: 400,
	color: 'primary.500',
};

export const BtnCta: any = {
	item: {
		alignSelf: {
			md: 'start',
		},
		rowStart: 2,
		rowEnd: -1,
		colStart: {
			lg: 2,
			md: 2,
			sm: 1,
		},
		colEnd: {
			lg: 6,
			md: 8,
			sm: -1,
		},
		w: '100%',
	},

	itemGrid: {
		w: {
			sm: '100%',
			lg: '100%',
		},
		templateColumns: 'repeat(2, 1fr)',
		justifyItems: {
			sm: 'center',
			md: 'start',
		},
	},
};

export const LoginBtn: any = {
	textTransform: 'uppercase',
	w: {
		sm: '8rem',
	},
	size: 'lg',
	variant: 'outline',
	borderColor: 'gray',
	borderWidth: '2px',
	colorScheme: 'gray',
};

export const RegisterBtn: any = {
	textTransform: 'uppercase',
	size: 'lg',
	w: {
		sm: '8rem',
	},
	colorScheme: 'primary',
	variant: 'solid',
};

export const Svg: any = {
	alignself: 'center',
	justifySelf: 'center',
	width: '50rem',
	height: '50rem',
	rowStart: 1,
	rowEnd: 12,
	colStart: 8,
	colEnd: 12,
};
