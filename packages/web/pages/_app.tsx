import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import * as React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate } from 'react-query/hydration';
import theme from '../lib/theme';
import Layout from '../src/shared/components/Layout';

import './../scss/main.scss';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	const [queryClient] = React.useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<ChakraProvider resetCSS theme={theme}>
				<Hydrate state={pageProps.dehydratedState}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
					<ReactQueryDevtools />
				</Hydrate>
			</ChakraProvider>
		</QueryClientProvider>
	);
};

export default MyApp;
