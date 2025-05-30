// import { authenticate } from "../shopify.server";
import { verifyShopifyWebhook } from "../utils/webhook.server";
import { deleteEmbedCode } from "../atchr.server";

export const action = async ({ request }) => {
  try {
    // This authenticate.webhook call handles HMAC validation automatically
    // const { shop, session, topic, payload } = await authenticate.webhook(request);

    // 1) Validate HMAC & grab raw body
    const rawBody = await verifyShopifyWebhook(request);

    // 2) Pull headers for shop & topic
    const shop = request.headers.get("x-shopify-shop-domain");
    const topic = request.headers.get("x-shopify-topic");
 
    console.log(`Received ${topic} webhook for ${shop}`);

    try {
      await deleteEmbedCode(shop);
      console.log(`Successfully cleaned up Atchr data for ${shop}`);
    } catch (cleanupError) {
      console.error(`Failed to cleanup data for ${shop}:`, cleanupError);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error processing app uninstalled webhook:", error);
    
    // The authenticate.webhook function throws specific errors for HMAC validation failures
    // Return 401 for authentication/HMAC failures
    if (error.message?.includes('webhook') || 
        error.message?.includes('signature') || 
        error.message?.includes('authentication') ||
        error.message?.includes('HMAC') ||
        error.message?.includes('Unauthorized') ||
        error.status === 401) {

      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // For other errors, return 500
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
