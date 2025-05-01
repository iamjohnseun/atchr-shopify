import { getEmbedCode, deleteEmbedCode } from "./services/atchr.server";

export function setupGDPRWebhooks(app) {
  // Add these handlers to your existing webhooks

  app.webhooks.addHandlers({
    CUSTOMERS_DATA_REQUEST: {
      deliveryMethod: "http",
      callbackUrl: "/api/webhooks",
      callback: async (topic, shop, body) => {
        // We don't store customer data, so no action needed
      },
    },

    CUSTOMERS_REDACT: {
      deliveryMethod: "http",
      callbackUrl: "/api/webhooks",
      callback: async (topic, shop, body) => {
        // We don't store customer data, so no action needed
      },
    },

    SHOP_REDACT: {
      deliveryMethod: "http",
      callbackUrl: "/api/webhooks",
      callback: async (topic, shop, body) => {
        try {
          await deleteEmbedCode(shop);
        } catch (error) {
          console.error(`Failed to delete data for ${shop}`, error);
        }
      },
    },
  });
}
