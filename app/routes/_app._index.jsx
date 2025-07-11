import { useNavigate } from "@remix-run/react";
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
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  const navigate = useNavigate();
  
  const handleConfigureClick = () => {
    navigate("/settings");
  };

  return (
    <Page fullWidth>
      <TitleBar title="Atchr Messaging" />
      <BlockStack gap="500">
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
                  <Text variant="headingMd">Setup Instructions</Text>
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
                </BlockStack>
                
                <Box paddingBlockStart="400">
                  <InlineStack gap="300">
                    <Button primary onClick={handleConfigureClick}>
                      Configure Atchr Messaging
                    </Button>
                    <Button url="https://atchr.com/register" external target="_blank">
                      Create an account
                    </Button>
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
