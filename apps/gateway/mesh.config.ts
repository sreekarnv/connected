import { defineConfig } from "@graphql-mesh/compose-cli";
import { loadOpenAPISubgraph } from "@omnigraph/openapi";
import { serviceOptions } from "./config.ts";

export const composeConfig = defineConfig({
  subgraphs: [
    {
      sourceHandler: loadOpenAPISubgraph(
        "Identity",
        serviceOptions("identity", 4001),
      ),
    },
    {
      sourceHandler: loadOpenAPISubgraph(
        "Social",
        serviceOptions("social", 4003),
      ),
    },
    {
      sourceHandler: loadOpenAPISubgraph(
        "Content",
        serviceOptions("content", 4004),
      ),
    },
  ],
});
