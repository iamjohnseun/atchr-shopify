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
    console.log("Customer redact payload:", payload);
    
    // Extract customer information from payload
    const customerId = payload.customer?.id;
    const customerEmail = payload.customer?.email;
    
    // App only stores entity IDs in metafields and no customer data,
    // there's typically nothing to redact
    
    // If you stored customer data, you would:
    // 1. Find all records associated with this customer
    // 2. Delete or anonymize the data
    // 3. Log the deletion for compliance
    
    console.log(`Customer redaction completed for customer ${customerId} in shop ${shop}`);
    
    const redactionLog = {
      shop,
      customerId,
      customerEmail,
      timestamp: new Date().toISOString(),
      action: "redacted",
      dataTypes: "none - app stores no customer data"
    };
    
    console.log("Redaction log:", redactionLog);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Error processing customer redact webhook:", error);
    
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