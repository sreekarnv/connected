const styles = {
	container: {
		bg: 'primary.600',
		py: 5,
		mb: 5,
		px: 16,
		mx: 'auto',
		w: {
			lg: '80%',
			md: '90%',
			sm: '100%',
		},
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	userContainer: {
		direction: 'column' as any,
		textAlign: 'left' as any,
	},
	userContainerHeading: {
		mb: 1,
		color: '#fff',
		textTransform: 'capitalize' as any,
		size: 'md',
	},
	btnTooltip: {
		hasArrow: true,
		textTransform: 'capitalize' as any,
		fontSize: 'sm',
	},
	btn: {
		bg: 'primary.200',
		_hover: {
			bg: 'primary.400',
		},
	},
};

export default styles;
