"use client";

import { useClient } from "@urql/next";
import { useCallback, useEffect, useState } from "react";
import type { Client } from "urql";
import {
  RefreshDocument,
  type RefreshMutation,
  type RefreshMutationVariables,
} from "~/graphql/generated/graphql";
import { hasAuthErrorCode } from "~/lib/auth-feedback";
import { createSessionRequest, type SessionResult } from "./session-request";

const sessions = new WeakMap<Client, ReturnType<typeof createSessionRequest>>();

function sessionFor(client: Client) {
  let session = sessions.get(client);
  if (!session) {
    session = createSessionRequest(async () => {
      const result = await client
        .mutation<RefreshMutation, RefreshMutationVariables>(
          RefreshDocument,
          {},
        )
        .toPromise();
      if (
        hasAuthErrorCode(result.error, "UNAUTHENTICATED") ||
        hasAuthErrorCode(result.error, "EMAIL_NOT_VERIFIED")
      ) {
        return { status: "signed-out" };
      }
      if (result.error || !result.data?.refresh?.access_token) {
        return { status: "error" };
      }
      return { status: "ready", accessToken: result.data.refresh.access_token };
    });
    sessions.set(client, session);
  }
  return session;
}

export function useSession() {
  const client = useClient();
  const [state, setState] = useState<SessionResult | { status: "loading" }>({
    status: "loading",
  });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((attempt) => attempt + 1);
  }, []);

  useEffect(() => {
    let active = true;
    void sessionFor(client)
      .restore()
      .then((next) => {
        if (active) setState(next);
      });
    return () => {
      active = false;
    };
  }, [client, attempt]);

  return { ...state, retry };
}
