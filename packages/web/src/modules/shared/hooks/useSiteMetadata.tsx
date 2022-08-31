import { graphql, useStaticQuery } from 'gatsby';

export const SITE_METADATA_QUERY = graphql`
	query SiteMetaData {
		site {
			siteMetadata {
				title
				siteUrl
				description
			}
		}
	}
`;

export const useSiteMetadata = () => {
	const { site } = useStaticQuery(SITE_METADATA_QUERY);
	return site.siteMetadata;
};
