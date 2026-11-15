"use client";

import { useClient } from "@urql/next";
import { useEffect, useState } from "react";
import type { Client } from "urql";
import {
  MeDocument,
  RefreshDocument,
  type MeQuery,
  type MeQueryVariables,
  type RefreshMutation,
  type RefreshMutationVariables,
} from "~/graphql/generated/graphql";
import { hasAuthErrorCode } from "~/lib/auth-feedback";

type SessionState =
  | { status: "loading" | "signed-out" | "error" }
  | { status: "ready"; user: NonNullable<MeQuery["me"]> };

// Share in-flight checks: rotating the same refresh cookie twice revokes it.
const requests = new WeakMap<Client, Promise<SessionState>>();

async function loadSession(client: Client): Promise<SessionState> {
  const session = await client
    .mutation<RefreshMutation, RefreshMutationVariables>(RefreshDocument, {})
    .toPromise();
  if (
    hasAuthErrorCode(session.error, "UNAUTHENTICATED") ||
    hasAuthErrorCode(session.error, "EMAIL_NOT_VERIFIED")
  ) {
    return { status: "signed-out" };
  }
  if (session.error || !session.data?.refresh?.access_token) {
    return { status: "error" };
  }

  const result = await client
    .query<MeQuery, MeQueryVariables>(
      MeDocument,
      {},
      {
        requestPolicy: "network-only",
        fetchOptions: {
          credentials: "include",
          headers: {
            "X-CSRF-Protection": "1",
            Authorization: `Bearer ${session.data.refresh.access_token}`,
          },
        },
      },
    )
    .toPromise();
  if (
    hasAuthErrorCode(result.error, "UNAUTHENTICATED") ||
    hasAuthErrorCode(result.error, "EMAIL_NOT_VERIFIED") ||
    (!result.error && result.data?.me === null)
  ) {
    return { status: "signed-out" };
  }
  if (result.error || !result.data?.me) return { status: "error" };
  return { status: "ready", user: result.data.me };
}

export function useSession() {
  const client = useClient();
  const [state, setState] = useState<SessionState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    let request = requests.get(client);
    if (!request) {
      request = loadSession(client).catch((): SessionState => ({
        status: "error",
      }));
      requests.set(client, request);
      void request.then(() => requests.delete(client));
    }
    void request.then((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
    };
  }, [client]);

  return state;
}
