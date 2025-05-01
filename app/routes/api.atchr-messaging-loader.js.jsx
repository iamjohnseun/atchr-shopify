import { getEmbedCode } from "../services/atchr.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  if (!shop) {
    return new Response("Shop parameter is required", { status: 400 });
  }
  
  try {
    const embedCode = await getEmbedCode(shop);
    
    if (!embedCode) {
      return new Response("// Atchr Messaging not configured", {
        headers: {
          "Content-Type": "application/javascript",
          "Cache-Control": "no-cache",
        },
      });
    }
    
    const script = `
      (function() {
        var elem = document.createElement("script"),
          frame = document.getElementsByTagName("script")[0];
        elem.async = true;
        elem.src = "https://embed.atchr.com/${embedCode}";
        elem.charset = "UTF-8";
        elem.setAttribute("crossorigin", "*");
        elem.setAttribute("scrolling", "no");
        elem.setAttribute("allowTransparency", "true");
        frame.parentNode.insertBefore(elem, frame);
      })();
    `;
    
    return new Response(script, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error serving loader script:", error);
    return new Response("// Error loading Atchr Messaging widget", {
      status: 500,
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "no-cache",
      },
    });
  }
};