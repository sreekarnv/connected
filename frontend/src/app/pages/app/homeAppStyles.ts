const styles = {
	container: {
		templateColumns: { xs: 'repeat(14, 1fr)' },
		h: {
			md: '91vh',
			sm: 'auto',
		},
	},
	leftSidebar: {
		p: {
			xl: 3,
			lg: 0,
		},
		colStart: {
			lg: 1,
		},
		colEnd: {
			'1778px': 4,
			lg: 5,
		},
	},
	content: {
		colStart: {
			'1778px': 4,
			lg: 5,
			md: 2,
			sm: 1,
		},
		colEnd: {
			'1778px': 12,
			lg: 11,
			md: 14,
			sm: -1,
		},
	},
	rightSidebar: {
		p: {
			xl: 3,
			lg: 0,
		},
		colStart: {
			'1778px': 12,
			lg: 11,
		},
		colEnd: 15,
	},
};

export default styles;
