const styles = {
	container: {
		mb: {
			md: 14,
			sm: 20,
		},
		direction: 'column' as any,
	},
	contentContainer: {
		columnGap: 8,
		p: 4,
		border: '1px solid',
		borderRadius: '15px',
		borderColor: 'primary.200',
		templateRows: 'max-content max-content 1fr',
		templateColumns: 'max-content 1fr',
	},
	photoContainer: {
		mt: 10,
		colStart: 1,
		colEnd: -1,
		justifySelf: 'center',
		rowStart: 3,
		rowEnd: 4,
	},
	photo: {
		boxSize: '400px',
		h: {
			md: '400px',
			sm: 'auto',
		},
	},
	footer: {
		mt: 3,
		border: '1px solid',
		borderRadius: '15px',
		borderColor: 'primary.200',
		px: 4,
		py: 2,
		justifyContent: {
			md: 'flex-end',
			sm: 'center',
		},
		spacing: 4,
	},
	footerIcon: {
		height: '1.5rem',
		fill: 'dodgerblue',
	},
};

export default styles;
