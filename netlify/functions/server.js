import { createRequestHandler } from "@remix-run/netlify";
import * as build from "../../build/server/index.js";

export const handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: () => ({}),
});

export const config = {
  headers: [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Frame-Options",
          value: "ALLOWALL",
        },
        {
          key: "Content-Security-Policy",
          value: "frame-ancestors https://*.myshopify.com https://admin.shopify.com;",
        },
      ],
    },
  ],
};