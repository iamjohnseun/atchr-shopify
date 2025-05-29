import { deleteEmbedCode } from "./atchr.server";

export async function handleWebhook(topic, shop, payload) {
  switch (topic) {
    case "APP_UNINSTALLED":
      await deleteEmbedCode(shop);
      break;
    
    default:
      console.log(`Unhandled webhook topic: ${topic}`);
  }
}
