import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { shop, payload, topic } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for ${shop}`);
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
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};