"use client";

import React from "react";
import { UrqlProvider as _UrqlProvider, ssrExchange } from "@urql/next";
import { makeClient } from "./client";

function UrqlProvider({ children }: React.PropsWithChildren) {
  const [client, ssr] = React.useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== "undefined",
    });

    const client = makeClient(ssr);

    return [client, ssr];
  }, []);

  return (
    <_UrqlProvider ssr={ssr} client={client}>
      {children}
    </_UrqlProvider>
  );
}

export default UrqlProvider;
