const styles = {
	outerContainer: {
		mx: {
			lg: 10,
			md: 4,
		},

		h: '90vh',
		overflowY: 'scroll' as any,
	},
	// simple grid
	innerContainer: {
		py: 10,
		rowGap: {
			sm: 10,
			md: 0,
		},
		h: { lg: '65vh', sm: 'auto' },
		columns: {
			lg: 2,
			md: 1,
		},
		justifyItems: 'center',
	},
	iconbtn: {
		cursor: 'pointer' as any,
		bgGradient: 'linear(primary.600, secondary.400)',
		pos: 'absolute' as any,
		borderRadius: '50%',
		transition: 'all .3s ease-out',
		_hover: {
			bgGradient: 'linear(secondary.400, primary.500)',
		},
		_active: {
			bgGradient: 'linear(secondary.400, primary.500)',
		},
	},
	iconbtnDel: {
		cursor: 'pointer' as any,
		bgGradient: 'linear(red.600, red.400)',
		pos: 'absolute' as any,
		borderRadius: '50%',
		transition: 'all .3s ease-out',
		_hover: {
			bgGradient: 'linear(red.400, red.500)',
		},
		_active: {
			bgGradient: 'linear(red.400, red.500)',
		},
	},
};

export default styles;
