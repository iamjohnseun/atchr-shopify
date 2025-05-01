import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getEmbedCode, saveEmbedCode } from "../atchr.server";

export async function loader({ request }) {
  const { session } = await authenticate(request);
  const shop = session.shop;
  
  const embedCode = await getEmbedCode(shop);
  return json({ embedCode });
}

export async function action({ request }) {
  const { session } = await authenticate(request);
  const shop = session.shop;
  
  const data = await request.formData();
  const embedCode = data.get("embedCode");
  
  await saveEmbedCode(shop, embedCode);
  
  // Create or update script tag
  const client = new shopify.api.clients.Rest({ session });
  
  // Get existing script tags
  const scriptTags = await client.get({
    path: 'script_tags',
  });
  
  const existingScriptTag = scriptTags.body.script_tags.find(
    tag => tag.src.includes('atchr-messaging-loader.js')
  );
  
  const scriptTagUrl = `${process.env.HOST}/api/atchr-messaging-loader.js?shop=${shop}`;
  
  if (existingScriptTag) {
    // Update existing script tag
    await client.put({
      path: `script_tags/${existingScriptTag.id}`,
      data: {
        script_tag: {
          event: 'onload',
          src: scriptTagUrl,
        },
      },
    });
  } else {
    // Create new script tag
    await client.post({
      path: 'script_tags',
      data: {
        script_tag: {
          event: 'onload',
          src: scriptTagUrl,
        },
      },
    });
  }
  
  return json({ success: true });
}