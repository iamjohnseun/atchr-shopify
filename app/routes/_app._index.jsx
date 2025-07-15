import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Banner,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getEmbedCode } from "../atchr.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const embedCode = await getEmbedCode(admin);
  return json({
    embedCode,
    shop: session.shop,
  });
};

export default function Index() {
  const navigate = useNavigate();
  const { embedCode, shop } = useLoaderData();
  
  const handleConfigureClick = () => {
    navigate("/settings");
  };

  const isConfigured = embedCode && embedCode.trim() !== "";

  return (
    <Page fullWidth>
      <TitleBar title="Atchr Messaging" />
      <BlockStack gap="500">
        {isConfigured && (
          <Banner title="Widget Configured" tone="success">
            <Text>
              Atchr Messaging is configured and ready to use! 
              You can now add it to your theme and view it on your storefront.
            </Text>
          </Banner>
        )}
        
        <Layout>
          <Layout.Section variant="twoThird">
            <Card>
              <BlockStack gap="400" padding="500">
                <Box paddingBlockStart="300">
                  <Text variant="bodyLg">
                    Atchr by Chromesque is a secure AI Chatbot, Instant messaging & Analytics platform for organizations, businesses, teams and individuals.
                  </Text>
                </Box>
                
                <Box paddingBlockStart="300">
                  <Text variant="bodyMd">
                    Atchr provides a secure business communications platform that bridges the divide between you, your customers, and your team. Our suite of tools, widgets, and features keeps you informed about your website's performance and audience interactions.
                  </Text>
                </Box>
                
                <BlockStack gap="300">
                  <Text variant="headingMd">
                    {isConfigured ? "Your Widget is Ready" : "Setup Instructions"}
                  </Text>
                  
                  {isConfigured ? (
                    <List>
                      <List.Item>
                        Entity ID configured: {embedCode.substring(0, 8)}xxxxxxxx
                      </List.Item>
                      <List.Item>
                        Add the widget to your theme via <strong>Online Store → Themes → Customize → App embeds</strong>
                      </List.Item>
                      <List.Item>
                        Visit your storefront to see the chat widget.
                      </List.Item>
                      <List.Item>
                        You can manage and customize your widget from the{" "}
                        <Link url="https://atchr.com/redirect" external target="_blank">
                          Atchr Dashboard
                        </Link>
                      </List.Item>
                    </List>
                  ) : (
                    <List type="number">
                      <List.Item>
                        <Link url="https://atchr.com/register" external target="_blank">
                          Create an Atchr account
                        </Link> (if you don't have one)
                      </List.Item>
                      <List.Item>Get your Entity ID from the Atchr dashboard</List.Item>
                      <List.Item>Configure the app with your Entity ID</List.Item>
                      <List.Item>Add the Atchr Chat Widget app block to your theme</List.Item>
                    </List>
                  )}
                </BlockStack>
                
                <Box paddingBlockStart="400">
                  <InlineStack gap="300">
                    <Button primary onClick={handleConfigureClick}>
                      {isConfigured ? "Update Settings" : "Configure Atchr Messaging"}
                    </Button>
                    <Button 
                      url={isConfigured ? "https://atchr.com/redirect" : "https://atchr.com/register"} 
                      external 
                      target="_blank"
                    >
                      {isConfigured ? "Open Dashboard" : "Create an account"}
                    </Button>
                    {isConfigured && (
                      <Button 
                        url={`https://${shop}`} 
                        external 
                        target="_blank"
                      >
                        View Storefront
                      </Button>
                    )}
                  </InlineStack>
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200" padding="400">
                  <Text variant="headingMd">Features</Text>
                  <List>
                    <List.Item>AI-powered chatbot</List.Item>
                    <List.Item>Real-time messaging</List.Item>
                    <List.Item>Team collaboration</List.Item>
                    <List.Item>Visitor analytics</List.Item>
                    <List.Item>Website monitoring</List.Item>
                    <List.Item>Customer support tools</List.Item>
                  </List>
                </BlockStack>
              </Card>
              
              <Card>
                <BlockStack gap="200" padding="400">
                  <Text variant="headingMd">Resources</Text>
                  <List>
                    <List.Item>
                      <Link url="https://atchr.com/download" external target="_blank">
                        Download App
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link url="https://atchr.com/support" external target="_blank">
                        Documentation
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link url="mailto:support@chromesque.com" external target="_blank">
                        Support
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link url="https://atchr.com/terms" external target="_blank">
                        Terms of Service
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
