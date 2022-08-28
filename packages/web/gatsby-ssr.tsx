import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { GatsbySSR } from 'gatsby';
import AppProvider from './src/modules/shared/providers/AppProvider';

const queryClient = new QueryClient();

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({
	element,
	props,
}) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ChakraProvider>
				<AppProvider>
					<Box {...props}>{element}</Box>
				</AppProvider>
			</ChakraProvider>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};
