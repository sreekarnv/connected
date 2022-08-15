import React from 'react';
import { HeadFC, Link } from 'gatsby';
import BaseLayout from '../modules/shared/layouts/BaseLayout';
import useLogoutMutation from '../modules/auth/hooks/useLogoutMutation';
// @ts-ignore
import HomeImage from '../images/home.svg';
import {
	Button,
	Grid,
	GridItem,
	Heading,
	HStack,
	useColorMode,
	GridProps,
	GridItemProps,
	HeadingProps,
	Image,
	Box,
	Flex,
} from '@chakra-ui/react';
import Logo from '../modules/shared/components/Logo';
import ThemeToggler from '../modules/shared/components/ThemeToggler';

export const Head: HeadFC = () => <title>Home</title>;

interface Styles {
	grid: GridProps;
	headingGridItem: GridItemProps;
	heading1: HeadingProps;
	heading2: HeadingProps;
	imageGridColumn: GridItemProps;
}

const IndexPage = () => {
	const { isLoading, mutate } = useLogoutMutation();
	const { colorMode } = useColorMode();

	return (
		<BaseLayout>
			{/* <h1>Hello World</h1>

			<div>
				<Link to='/auth/login'>Login</Link>
				<Link to='/auth/signup'>Signup</Link>
				<Link to='/app/profile'>Profile</Link>
				<Link to='/app/feed'>Feed</Link>
				<Link to='/app/posts/new'>Create Post</Link>

				<Button
					colorScheme='red'
					isLoading={isLoading}
					onClick={() => {
						mutate();
					}}>
					Logout
				</Button>

				<ThemeToggler />
			</div> */}

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
			<Grid {...styles.grid}>
				<GridItem {...styles.headingGridItem}>
					<Heading {...styles.heading1}>Always Stay</Heading>
					<Heading
						{...styles.heading2}
						color={colorMode === 'light' ? 'blue.500' : 'blue.300'}>
						Connected
					</Heading>

					<HStack spacing={10}>
						<Button as={Link} to='/auth/login' size='lg' variant='outline'>
							Log In
						</Button>

						<Button
							as={Link}
							to='/auth/signup'
							size='lg'
							variant='solid'
							colorScheme='blue'>
							Sign Up
						</Button>
					</HStack>
				</GridItem>
				<GridItem {...styles.imageGridColumn}>
					<Image
						src={HomeImage}
						boxSize={{
							base: 'full',
							sm: '600px',
							lg: '750px',
						}}
					/>
				</GridItem>
			</Grid>
		</BaseLayout>
	);
};

const styles: Styles = {
	grid: {
		minH: {
			lg: '91vh',
			base: '80vh',
		},
		templateColumns: {
			md: 'repeat(12, 1fr)',
			base: 'repeat(6, 1fr)',
		},
		alignItems: 'center',
		justifyItems: {
			base: 'center',
			sm: 'start',
		},
		p: {
			sm: '10',
			base: '5',
		},
		gridRowGap: {
			sm: 0,
			base: 10,
		},
	},
	headingGridItem: {
		gridColumn: {
			'2xl': '2/6',
			lg: '1/6',
			base: '1 / -1',
		},
	},
	heading1: {
		fontSize: {
			'2xl': '7xl',
			lg: '6xl',
			md: '5xl',
			sm: '6xl',
			base: '4xl',
		},
		textAlign: {
			base: 'center',
			sm: 'start',
		},
	},
	heading2: {
		textAlign: { base: 'center', sm: 'start' },
		fontSize: {
			'2xl': '9xl',
			xl: '8xl',
			lg: '7xl',
			md: '6xl',
			sm: '7xl',
			base: '5xl',
		},
		mb: 50,
	},
	imageGridColumn: {
		gridColumn: {
			lg: '6 / 13',
			base: '1 / -1',
		},
		justifySelf: 'end',
	},
};

export default IndexPage;
