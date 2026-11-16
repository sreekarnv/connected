import { CombinedError } from "urql";

export function fieldError(error: CombinedError | undefined, field: string) {
  if (!error) return undefined;
  const graphQLErrors = error.graphQLErrors.filter(
    (item) => !item.path || item.path[0] === field,
  );
  return error.networkError || graphQLErrors.length
    ? new CombinedError({
        graphQLErrors,
        networkError: error.networkError,
        response: error.response,
      })
    : undefined;
}
