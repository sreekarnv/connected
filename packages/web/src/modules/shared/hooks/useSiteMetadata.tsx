// @ts-ignore
import OgImage from '../../../images/og-image.png';
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
	return { image: OgImage, ...site.siteMetadata };
};
