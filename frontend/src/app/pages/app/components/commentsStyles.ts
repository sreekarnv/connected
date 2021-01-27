const styles = {
	container: {
		size: 'full' as any,
		motionPreset: 'slideInBottom' as any,
		scrollBehavior: 'inside' as any,
	},
	contentOuterBox: {
		mb: 0,
		maxHeight: '100vh',
	},
	contentInnerBox: {
		m: {
			lg: '0 200px',
			md: '0 100px',
			sm: '0',
		},
	},
	header: {
		d: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	addCommentIcon: {
		bg: 'primary.600',
		_hover: {
			bg: 'primary.300',
		},
	},
	body: {
		overflowY: 'scroll' as any,
		spacing: 10,
		p: 5,
		h: '70vh',
		mb: 0,
	},
};

export default styles;
