import type { GatsbyConfig } from 'gatsby';
import dotenv from 'dotenv';

dotenv.config({
	path: `.env`,
});

const config: GatsbyConfig = {
	siteMetadata: {
		title: `Always Stay Connected`,
		siteUrl: `${process.env.GATSBY_SERVER_URL}`,
		description: `Connected is a platform for connecting people with the same interests.`,
	},
	// More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
	// If you use VSCode you can also use the GraphQL plugin
	// Learn more at: https://gatsby.dev/graphql-typegen
	graphqlTypegen: true,
	plugins: [
		'gatsby-plugin-image',
		{
			resolve: 'gatsby-plugin-sitemap',
		},
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				icon: 'src/images/icon.png',
			},
		},
		'gatsby-plugin-sharp',
		'gatsby-transformer-sharp',
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'images',
				path: './src/images/',
			},
			__key: 'images',
		},
		{
			resolve: `gatsby-plugin-netlify`,
			options: {
				mergeSecurityHeaders: true,
				mergeCachingHeaders: true,
				generateMatchPathRewrites: true,
			},
		},
	],
};

export default config;
