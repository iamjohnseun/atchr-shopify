import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { shop, payload, topic } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for ${shop}`);
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
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};