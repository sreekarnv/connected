import * as React from 'react';
import { useQueryClient } from 'react-query';
import { Route, Switch } from 'react-router-dom';

const OnBoarding = React.lazy(() => import('../../Home/pages/OnBoarding'));
const Home = React.lazy(() => import('../../Home/pages/Home'));
const Auth = React.lazy(() => import('../../Auth'));

interface BodyProps {}

const Body: React.FC<BodyProps> = ({}) => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData('me');
	return (
		<Switch>
			<Route path='/' exact>
				{user ? <Home /> : <OnBoarding />}
			</Route>
			<Route path='/auth'>
				<Auth />
			</Route>
		</Switch>
	);
};

export default Body;
