import React from 'react';

interface LogoProps {}

const Logo: React.FC<LogoProps> = ({}) => {
	return (
		<>
			<svg
				id='Component_1_1'
				data-name='Component 1 – 1'
				xmlns='http://www.w3.org/2000/svg'
				width='120'
				height='40'
				viewBox='0 0 176 62'>
				<text
					id='Connected'
					transform='translate(0 46)'
					fill='currentcolor'
					fontSize='50'
					fontFamily='Grinched'>
					<tspan x='0' y='0'>
						Connected
					</tspan>
				</text>
				<rect
					id='Rectangle_13'
					data-name='Rectangle 13'
					width='103'
					height='5'
					rx='2.5'
					transform='translate(4 57)'
					fill='#3182ce'
				/>
			</svg>
		</>
	);
};

export default Logo;
