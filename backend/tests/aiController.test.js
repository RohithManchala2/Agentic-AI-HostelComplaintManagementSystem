import test from "node:test";
import assert from "node:assert/strict";

import { buildForwardedHeaders } from "../controllers/aiController.js";

test("buildForwardedHeaders forwards the original browser cookie header", () => {
  const req = {
    headers: {
      cookie: "token=abc123; other=value",
    },
  };

  assert.deepEqual(buildForwardedHeaders(req), {
    "Content-Type": "application/json",
    Cookie: "token=abc123; other=value",
  });
});

test("buildForwardedHeaders falls back to parsed cookies when no header exists", () => {
  const req = {
    cookies: {
      token: "abc123",
    },
    headers: {},
  };

  assert.deepEqual(buildForwardedHeaders(req), {
    "Content-Type": "application/json",
    Cookie: "token=abc123",
  });
});
