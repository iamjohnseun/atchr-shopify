import crypto from "crypto";

/**
 * Reads the raw request body, verifies the Shopify HMAC header,
 * and returns the raw string if valid. Throws on failure.
 */
export async function verifyShopifyWebhook(request) {
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  if (!hmacHeader) {
    const e = new Error("Missing Shopify HMAC header");
    e.status = 401;
    throw e;
  }

  const body = await request.clone().text();

  const digest = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET || "")
    .update(body, "utf8")
    .digest("base64");

  const bufferDigest = Buffer.from(digest, "utf8");
  const bufferHeader = Buffer.from(hmacHeader, "utf8");
  if (
    bufferDigest.length !== bufferHeader.length ||
    !crypto.timingSafeEqual(bufferDigest, bufferHeader)
  ) {
    const e = new Error("HMAC mismatch");
    e.status = 401;
    throw e;
  }

  return body;
}