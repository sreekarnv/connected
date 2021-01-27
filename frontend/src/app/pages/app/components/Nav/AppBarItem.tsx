import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { NavLink } from 'react-router-dom';

// import { styles } from './styles';

interface Props {
	to?: string;
	exact?: boolean;
	as?: any;
	onClick?: () => void;
	active?: boolean;
	label: string;
	icon: any;
	m?: string;
}

const AppBarItem: React.FC<Props> = ({
	as,
	label,
	icon,
	to,
	onClick,
	exact,
	m,
}) => {
	return (
		<IconButton
			as={as || NavLink}
			to={to}
			exact={exact}
			cursor='pointer'
			bgGradient='linear(to-br, primary.200, primary.600)'
			_activeLink={{
				background: 'primary.900',
			}}
			_active={{
				background: 'primary.400',
			}}
			_hover={{
				background: 'primary.400',
			}}
			_focus={{
				boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
				background: 'primary.400',
			}}
			h='3.5rem'
			w='3.5rem'
			m={m}
			aria-label={label}
			icon={icon}
			onClick={onClick}
		/>
	);
};

export default AppBarItem;
