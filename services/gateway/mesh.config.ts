import { defineConfig } from "@graphql-mesh/compose-cli";
import { loadOpenAPISubgraph } from "@omnigraph/openapi";

const identityURL = process.env.IDENTITY_URL ?? "http://localhost:4001";
const socialURL = process.env.SOCIAL_URL ?? "http://localhost:4003";

export const composeConfig = defineConfig({
  subgraphs: [
    {
      sourceHandler: loadOpenAPISubgraph("Identity", {
        source: `${identityURL}/openapi.json`,
        endpoint: identityURL,
        ignoreErrorResponses: true,
        operationHeaders: {
          Authorization: "{context.headers.authorization}",
        },
      }),
    },
    {
      sourceHandler: loadOpenAPISubgraph("Social", {
        source: `${socialURL}/openapi.json`,
        endpoint: socialURL,
        ignoreErrorResponses: true,
        operationHeaders: {
          Authorization: "{context.headers.authorization}",
        },
      }),
    },
  ],
});
