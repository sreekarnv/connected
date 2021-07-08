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
			_hover={{
				bgColor: 'primary.300',
			}}
			_active={{
				bgColor: 'primary.400',
			}}
			_focus={{
				bgColor: 'primary.400',
			}}
			cursor='pointer'
			h='3.5rem'
			w='3.5rem'
			bgColor='primary.300'
			m={m}
			aria-label={label}
			icon={icon}
			onClick={onClick}
		/>
	);
};

export default AppBarItem;
