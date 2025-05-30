// import { authenticate } from "../shopify.server";
import { verifyShopifyWebhook } from "../utils/webhook.server";

export const action = async ({ request }) => {
  try {
    // const { payload, session, topic, shop } = await authenticate.webhook(request);
    // 1) Validate HMAC & grab raw body
    const rawBody = await verifyShopifyWebhook(request);

    // 2) Pull headers for shop & topic
    const shop = request.headers.get("x-shopify-shop-domain");
    const topic = request.headers.get("x-shopify-topic");

    console.log(`Received ${topic} webhook for ${shop}`);

    // 3) Parse payload and process
    const payload = JSON.parse(rawBody);
    const current = payload.current;
    
    console.log(`Scope updated for ${shop}: ${current.toString()}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error processing scopes update webhook:", error);

    if (error.message?.includes('webhook') || 
        error.message?.includes('signature') || 
        error.message?.includes('authentication') ||
        error.message?.includes('HMAC') ||
        error.message?.includes('Unauthorized') ||
        error.status === 401
      ) {
      console.error("HMAC validation failed for scopes update webhook");

      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
