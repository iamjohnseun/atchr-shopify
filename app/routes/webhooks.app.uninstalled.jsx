import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // When the app is uninstalled, Shopify automatically removes all app metafields
  // No manual cleanup needed
  
  // Note: Session cleanup is handled by the session storage (MemorySessionStorage)
  // and will be cleared when the app restarts or sessions expire

  return new Response();
};
