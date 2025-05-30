import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import { verifyShopifyHmac } from "../utils/hmac.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const hmac = url.searchParams.get('hmac');
  const shop = url.searchParams.get('shop');
  
  if (hmac) {
    const isValidHmac = verifyShopifyHmac(request);
    if (!isValidHmac) {
      throw new Response("Unauthorized - Invalid HMAC", { status: 401 });
    }
  }

  await authenticate.admin(request);

  return { 
    apiKey: process.env.SHOPIFY_API_KEY || "",
    shop: shop || ""
  };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/settings">Settings</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
