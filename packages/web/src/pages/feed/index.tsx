import { Box, Button } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerData, HeadFC, navigate } from 'gatsby';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import PostItem from '../../modules/app/components/PostItem';
import PostSkeleton from '../../modules/app/components/PostItemSkeleton';
import useGetAllPostsQuery from '../../modules/app/hooks/useGetAllPostsQuery';
import FeedLayout from '../../modules/app/layouts/FeedLayout';
import Loader from '../../modules/shared/components/Loader';
import axios from '../../modules/shared/config/axios';
import { useSiteMetadata } from '../../modules/shared/hooks/useSiteMetadata';
import { PostType } from '../../modules/shared/types/api';
import { RQ } from '../../modules/shared/types/react-query';

interface FeedPageProps {
	serverData: {
		data: {
			pages: {
				status: string;
				posts: PostType[];
				hasNext: boolean;
				currentPageParam: number;
			}[];
			pageParams: number[];
		};
		error: any;
	};
}

export const Head: HeadFC = () => {
	const siteData = useSiteMetadata();
	const title = `Dashboard | ${siteData.title}`;

	return (
		<>
			<title>{title}</title>
			<meta name='description' content={siteData.description} />

			<meta property='og:title' content={title} />
			<meta property='og:description' content={siteData.description} />
			<meta property='og:type' content={'website'} />
			<meta property='og:url' content={`${siteData.siteUrl}`} />
			<meta
				property='og:image'
				content={`${siteData.siteUrl}${siteData.image}`}
			/>
			<meta property='og:image:secure_url' content={siteData.image} />

			<meta name='twitter:card' content='summary' />
			<meta name='twitter:title' content={title} />
			<meta name='twitter:description' content={siteData.description} />
		</>
	);
};

export const getServerData: GetServerData<any> = async ({ headers }) => {
	try {
		const queryClient = new QueryClient();
		await queryClient.prefetchQuery([RQ.LOGGED_IN_USER_QUERY]);

		const res = await axios.get('/posts', {
			headers: {
				cookie: (headers.get('cookie') as string) || '',
			},
		});

		return {
			props: {
				dehydratedState: dehydrate(queryClient),
				data: {
					pages: [
						{
							status: 'success',
							posts: res.data.posts,
							hasNext: res.data.hasNext,
							currentPageParam: res.data.currentPageParam,
						},
					],
					pageParams: [null],
				},
			},
			headers: res.headers || {},
			status: res.status || 200,
		};
	} catch (error: any) {
		if (error?.response?.data?.error?.statusCode === 401) {
			const noAuthHeaders = new Map();
			noAuthHeaders.set('Location', '/');

			return {
				status: 200,
				props: {
					error: error?.response?.data || error,
				},
				headers: {
					Location: '/',
				},
			};
		}

		return {
			status: 200,
			headers: {
				Location: '/',
			},
			props: {
				error: error?.respone.data || error,
			},
		};
	}
};

const Success: React.FC<FeedPageProps> = ({ serverData }) => {
	const { data, fetchNextPage, isFetchingNextPage, isLoading } =
		useGetAllPostsQuery('', { initialData: serverData.data });
	const { ref, inView } = useInView();

	React.useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	if (isLoading) {
		return (
			<>
				{Array(3)
					.fill(0)
					.map((_, index) => (
						<PostSkeleton key={index} />
					))}
			</>
		);
	}

	return (
		<>
			<FeedLayout>
				<Box mt='8'>
					{data?.pages.map((page) => {
						return page?.posts.map((post: any) => (
							<PostItem
								pageParam={page.currentPageParam}
								post={post}
								key={post._id}
							/>
						));
					})}

					{data?.pages[data?.pages.length - 1].hasNext && (
						<Button
							mb='4'
							display='block'
							isLoading={isFetchingNextPage}
							mx='auto'
							ref={ref}
							onClick={() => {
								fetchNextPage();
							}}>
							Fetch Next
						</Button>
					)}
				</Box>
			</FeedLayout>
		</>
	);
};

const Error: React.FC<any> = () => {
	React.useEffect(() => {
		navigate('/auth/login', { replace: true });
	}, [navigate]);

	return (
		<>
			<Loader />
		</>
	);
};

const FeedPage: React.FC<FeedPageProps> = ({ serverData }) => {
	if (!serverData || serverData?.error) {
		return <Error />;
	}

	return (
		<>
			<Success {...{ serverData }} />
		</>
	);
};

export default FeedPage;
