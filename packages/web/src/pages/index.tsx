import React from 'react';
import { graphql, HeadFC, Link } from 'gatsby';
import BaseLayout from '../modules/shared/layouts/BaseLayout';
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
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { RQ } from '../modules/shared/types/react-query';

export const query = graphql`
	query SiteInfo {
		site {
			siteMetadata {
				title
				description
			}
		}
	}
`;

interface SiteMetadata {
	title: string;
	description: string;
}

export const Head: HeadFC = ({ data }) => {
	const siteData = (data as any).site.siteMetadata as SiteMetadata;
	const title = `${siteData.title} | Home`;
	const description = siteData.description;

	return <title>{title}</title>;
};

interface Styles {
	grid: GridProps;
	headingGridItem: GridItemProps;
	heading1: HeadingProps;
	heading2: HeadingProps;
	imageGridColumn: GridItemProps;
}

const IndexPage = () => {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData([RQ.LOGGED_IN_USER_QUERY]);
	const { colorMode } = useColorMode();

	return (
		<BaseLayout>
			<Grid {...styles.grid}>
				<GridItem {...styles.headingGridItem}>
					<Heading {...styles.heading1}>Always Stay</Heading>
					<Heading
						{...styles.heading2}
						color={colorMode === 'light' ? 'blue.500' : 'blue.300'}>
						Connected
					</Heading>

					<HStack spacing={10}>
						{user ? (
							<>
								<Button
									as={Link}
									to='/app/feed'
									size='lg'
									variant='solid'
									colorScheme='blue'>
									Go to Feed
								</Button>
							</>
						) : (
							<>
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
							</>
						)}
					</HStack>
				</GridItem>
				<GridItem {...styles.imageGridColumn}>
					<Image src={HomeImage} height={{ base: '300px', lg: '600px' }} />
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
