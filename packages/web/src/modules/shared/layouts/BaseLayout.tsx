import { Box, Flex, HStack } from '@chakra-ui/react';
import React from 'react';
import Logo from '../components/Logo';
import ThemeToggler from '../components/ThemeToggler';

interface BaseLayoutProps {
	children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
	return (
		<>
			<Flex justifyContent='space-between' p='4'>
				<Box>
					<Logo />
				</Box>
				<HStack as='ul' listStyleType={'none'}>
					<Box as='li'>
						<ThemeToggler />
					</Box>
				</HStack>
			</Flex>
			<main>{children}</main>
		</>
	);
};

export default BaseLayout;
