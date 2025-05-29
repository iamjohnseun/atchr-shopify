import { authenticate } from "../shopify.server";
import { deleteEmbedCode } from "../atchr.server";

export const action = async ({ request }) => {
  try {
    const { topic, shop, session, payload } = await authenticate.webhook(request);

    if (!shop) {
      throw new Response("Shop parameter is required", { status: 400 });
    }

    if (topic === "APP_UNINSTALLED") {
      await deleteEmbedCode(shop);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};