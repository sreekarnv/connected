const styles = {
	container: {
		bg: 'secondary.200',
		w: '100%',
		pos: 'relative' as any,
		borderRadius: '4px',
		p: 10,
		templateRows: 'max-content 1fr',
	},
	avatar: {
		size: 'lg',
		top: '-15px',
		left: '-15px',
		pos: 'absolute' as any,
	},
	userBox: {
		mb: 5,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	userBoxHeading: {
		textColor: 'primary.900',
		textTransform: 'capitalize' as any,
		size: 'md',
	},
	userBoxText: {
		color: 'gray.500',
	},
	userComment: {
		color: 'gray.800',
		fontStyle: 'italic',
	},
};

export default styles;
