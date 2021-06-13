import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './config/theme';

const Layout = React.lazy(() => import('./layout'));

const queryClient = new QueryClient();

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<ChakraProvider theme={theme}>
				<QueryClientProvider client={queryClient}>
					<React.Suspense fallback={<p>Loading....</p>}>
						<Layout />
					</React.Suspense>
					{process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
				</QueryClientProvider>
			</ChakraProvider>
		</BrowserRouter>
	);
};

export default App;
