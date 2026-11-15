import {
  createClient,
  cacheExchange,
  fetchExchange,
  type Exchange,
  type SSRExchange,
} from "urql/core";

export const makeClient = (ssr?: SSRExchange) => {
  const exchanges: Exchange[] = [cacheExchange];
  const ssrExists = typeof ssr !== "undefined";

  if (ssrExists) {
    exchanges.push(ssr);
  }

  exchanges.push(fetchExchange);

  return createClient({
    url: process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:4000/graphql",
    exchanges,
    suspense: ssrExists,
    fetchOptions: {
      credentials: "include",
      headers: { "X-CSRF-Protection": "1" },
    },
  });
};
