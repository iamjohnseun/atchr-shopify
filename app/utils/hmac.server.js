import crypto from "crypto";

export function verifyHmac(query, secret) {
  const { hmac, ...params } = query;
  
  if (!hmac) {
    return false;
  }

  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const calculatedHmac = crypto
    .createHmac('sha256', secret)
    .update(sortedParams)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(hmac, 'hex'),
    Buffer.from(calculatedHmac, 'hex')
  );
}

export function verifyShopifyHmac(request) {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams);
  
  return verifyHmac(query, process.env.SHOPIFY_WEBHOOK_SECRET);
}