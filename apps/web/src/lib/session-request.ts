type Renewal =
  { status: "ready"; accessToken: string } | { status: "signed-out" | "error" };

type Access = { token: string; expiresAt: number; subject: string };
type Refreshed =
  { status: "ready"; access: Access } | { status: "signed-out" | "error" };

export type SessionResult =
  { status: "ready"; fetch: typeof fetch } | { status: "signed-out" | "error" };

export function createSessionRequest(renew: () => Promise<Renewal>) {
  let access: Access | undefined;
  let pending: Promise<Refreshed> | undefined;
  let protectedRequest: { subject: string; fetch: typeof fetch } | undefined;

  async function refresh(): Promise<Refreshed> {
    access = undefined;
    try {
      const result = await renew();
      if (result.status !== "ready") return result;
      const payload: unknown = JSON.parse(
        atob(
          result.accessToken
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/"),
        ),
      );
      if (
        typeof payload !== "object" ||
        payload === null ||
        !("exp" in payload) ||
        typeof payload.exp !== "number" ||
        !Number.isFinite(payload.exp) ||
        !Number.isFinite(payload.exp * 1000) ||
        payload.exp * 1000 <= Date.now() ||
        !("sub" in payload) ||
        typeof payload.sub !== "string" ||
        !payload.sub
      ) {
        return { status: "error" };
      }
      access = {
        token: result.accessToken,
        expiresAt: payload.exp * 1000,
        subject: payload.sub,
      };
      return { status: "ready", access };
    } catch {
      return { status: "error" };
    }
  }

  function load(): Promise<Refreshed> {
    if (!pending) {
      // shortcut: browsers without Web Locks only deduplicate within this client; add cross-tab coordination if those browsers are supported.
      pending = (async () =>
        typeof navigator !== "undefined" && navigator.locks
          ? await navigator.locks.request("connected-session-refresh", refresh)
          : await refresh())()
        .catch((): Refreshed => ({ status: "error" }))
        .finally(() => {
          pending = undefined;
        });
    }
    return pending;
  }

  function fetchFor(subject: string): typeof fetch {
    return async (input, init) => {
      const request = new Request(input, init);
      request.signal.throwIfAborted();
      let status: Refreshed["status"] = "ready";
      if (pending || !access || access.expiresAt <= Date.now() + 30_000) {
        status = (await load()).status;
        request.signal.throwIfAborted();
      }
      if (status === "signed-out" || (access && access.subject !== subject)) {
        return Response.json({
          data: null,
          errors: [
            {
              message: "Your session has ended. Sign in to continue.",
              extensions: { code: "UNAUTHENTICATED" },
            },
          ],
        });
      }
      if (status !== "ready" || !access) {
        throw new Error("Could not renew your session. Please try again.");
      }
      request.headers.set("Authorization", `Bearer ${access.token}`);
      return fetch(request);
    };
  }

  async function restore(): Promise<SessionResult> {
    const result = await load();
    if (result.status !== "ready") return result;
    if (protectedRequest?.subject !== result.access.subject) {
      protectedRequest = {
        subject: result.access.subject,
        fetch: fetchFor(result.access.subject),
      };
    }
    return { status: "ready", fetch: protectedRequest.fetch };
  }

  return { restore };
}
