import {
	defineConfig,
	loadGraphQLHTTPSubgraph,
} from "@graphql-mesh/compose-cli";
import { loadOpenAPISubgraph } from "@omnigraph/openapi";

export const composeConfig = defineConfig({
	subgraphs: [
		{
			sourceHandler: loadOpenAPISubgraph("Identity", {
				source: "http://localhost:4001/openapi.json",
				endpoint: "http://localhost:4001",
				ignoreErrorResponses: true,
				operationHeaders: {
					Authorization: "{context.headers.authorization}",
				},
			}),
		},
	],
});
