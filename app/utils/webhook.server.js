import crypto from "crypto";

export function verifyWebhookSignature(body, signature, secret) {
  if (!signature || !secret) {
    return false;
  }

  const cleanSignature = signature.replace(/^sha256=/, '');
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body, 'utf8');
  const calculatedSignature = hmac.digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(cleanSignature, 'hex'),
    Buffer.from(calculatedSignature, 'hex')
  );
}

export async function verifyShopifyWebhook(request) {
  const signature = request.headers.get('X-Shopify-Hmac-Sha256');
  const body = await request.text();
  const secret = process.env.SHOPIFY_API_SECRET;
  
  if (!verifyWebhookSignature(body, signature, secret)) {
    throw new Error('Webhook signature verification failed');
  }
  
  return JSON.parse(body);
}