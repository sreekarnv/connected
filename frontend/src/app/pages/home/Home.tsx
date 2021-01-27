import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Button, GridItem, Heading } from '@chakra-ui/react';

import * as homeStyles from './styles';

const Home: React.FC = () => {
	const { push } = useHistory();

	return (
		<Grid {...homeStyles.Wrapper}>
			<GridItem {...homeStyles.Heading}>
				<Heading {...homeStyles.HeadingMain}>Always Stay</Heading>
				<Heading {...homeStyles.HeadingSub}>connected</Heading>
			</GridItem>

			<GridItem {...homeStyles.BtnCta.item}>
				<Grid {...homeStyles.BtnCta.itemGrid}>
					<Button
						{...homeStyles.LoginBtn}
						onClick={() => push({ pathname: '/auth/login' })}>
						Login
					</Button>
					<Button
						{...homeStyles.RegisterBtn}
						onClick={() => push({ pathname: '/auth/register' })}>
						Register
					</Button>
				</Grid>
			</GridItem>
		</Grid>
	);
};

export default Home;
