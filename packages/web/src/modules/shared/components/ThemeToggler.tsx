import { HStack, Switch, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

interface ThemeTogglerProps {}

const ThemeToggler: React.FC<ThemeTogglerProps> = ({}) => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<>
			<HStack>
				{colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
				<Switch
					onChange={() => {
						toggleColorMode();
					}}
					colorScheme='blue'
					isChecked={colorMode === 'dark'}
				/>
			</HStack>
		</>
	);
};

export default ThemeToggler;
