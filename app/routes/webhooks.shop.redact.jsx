import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { shop, payload, topic } = await authenticate.webhook(request);
    
    console.log(`Received ${topic} webhook for ${shop}`);
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
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};