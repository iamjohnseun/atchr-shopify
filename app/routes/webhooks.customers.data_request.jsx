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
    console.log("Customer data request payload:", payload);
    
    const responseData = {
      message: "Atchr Messaging app does not store personal customer data. Only entity configuration is stored.",
      data_collected: "None - app only stores Atchr entity ID configuration",
      timestamp: new Date().toISOString()
    };
    
    // In a real implementation, you might:
    // - Email the merchant with the data
    // - Store the request for compliance records
    // - Generate a data export file
    
    console.log("Data request response:", responseData);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error processing data request webhook:", error);
    
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