import { Link } from 'gatsby';
import React from 'react';
import useGetAllPostsQuery from '../hooks/useGetAllPostsQuery';

interface FeedPageProps {
	path?: string;
}

const FeedPage: React.FC<FeedPageProps> = ({}) => {
	const { data } = useGetAllPostsQuery();

	return (
		<>
			<Link to='/'>Back</Link>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</>
	);
};

export default FeedPage;
