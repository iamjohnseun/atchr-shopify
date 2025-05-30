// import { authenticate } from "../shopify.server";
import { verifyShopifyWebhook } from "../utils/webhook.server";

export const action = async ({ request }) => {
  try {
    // const { shop, payload, topic } = await authenticate.webhook(request);
    // 1) Validate HMAC & grab raw body
    const rawBody = await verifyShopifyWebhook(request);
    // 2) Pull headers for shop & topic
    const shop = request.headers.get("x-shopify-shop-domain");
    const topic = request.headers.get("x-shopify-topic");
    
    console.log(`Received ${topic} webhook for ${shop}`);
    // 3) Parse payload and process
    const payload = JSON.parse(rawBody);
    console.log("Shop redact payload:", payload);
    
    // This webhook is called 48 hours after app uninstallation
    // ALL data associated with this shop must be deleted
    
    // Atchr only uses metafields, Shopify automatically deletes them
    // when the app is uninstalled, but let's log this for compliance
    
    // If we had any external data storage, we would delete it here:
    // - Database records
    // - Log files
    // - Cached data
    // - Analytics data
    // - etc.
    
    console.log(`Shop data redaction completed for ${shop}`);
    
    const redactionLog = {
      shop,
      timestamp: new Date().toISOString(),
      action: "shop_redacted",
      dataDeleted: "All app metafields (automatically handled by Shopify)",
      externalDataDeleted: "None - app uses only Shopify metafields"
    };
    
    console.log("Shop redaction log:", redactionLog);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error processing shop redact webhook:", error);
    
    if (
      error.message?.includes('webhook') || 
      error.message?.includes('signature') || 
      error.message?.includes('authentication') ||
      error.message?.includes('HMAC') ||
      error.message?.includes('Unauthorized') ||
      error.status === 401
      ) {
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

export const loader = async () => {
  return new Response(JSON.stringify({ 
    message: "This is a webhook endpoint. It only accepts POST requests from Shopify.",
    status: "ready"
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};