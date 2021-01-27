import React from 'react';
import { Flex, useColorMode, Switch, FlexProps } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const ThemeToggler: React.FC<FlexProps> = (props) => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Flex alignItems='center' {...props}>
			{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
			<Switch
				ml={2}
				isChecked={colorMode === 'dark'}
				onChange={toggleColorMode}>
				Toggle
			</Switch>
		</Flex>
	);
};

export default ThemeToggler;
