import "server-only";

import { registerUrql } from "@urql/next/rsc";
import { makeClient } from "./client";

export const { getClient } = registerUrql(makeClient);
