import { authenticate } from "../shopify.server";
import { verifyShopifyWebhook } from "../utils/webhook.server";

export const action = async ({ request }) => {
  try {
    const payload = await verifyShopifyWebhook(request);
    const { shop, topic } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for ${shop}`);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error processing app uninstalled webhook:", error);
    
    if (error.message.includes('signature verification')) {
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
