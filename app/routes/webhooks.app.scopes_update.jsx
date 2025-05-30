import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;

  // Since we're using MemorySessionStorage, we don't need to manually update
  // session scope in a database. The session storage will handle this automatically
  // when the merchant re-authenticates with the new scopes.
  
  console.log(`Scope updated for ${shop}: ${current.toString()}`);

  return new Response();
};
