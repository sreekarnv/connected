import React from 'react';
import { HeadFC } from 'gatsby';
import ProfileLayout from '../../modules/profile/layout/ProfileLayout';
import { Router } from '@reach/router';
import PrivateRoute from '../../modules/shared/components/PrivateRoute';
import ProfilePage from '../../modules/profile/pages/ProfilePage';
import { useSiteMetadata } from '../../modules/shared/hooks/useSiteMetadata';

interface ProfilePagesProps {}

export const Head: HeadFC = () => {
	const siteData = useSiteMetadata();
	const title = `Profile | ${siteData.title}`;

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

const ProfilePages: React.FC<ProfilePagesProps> = ({}) => {
	return (
		<>
			<ProfileLayout>
				<Router basepath='/profile'>
					<PrivateRoute path='/' component={ProfilePage} />
				</Router>
			</ProfileLayout>
		</>
	);
};

export default ProfilePages;
