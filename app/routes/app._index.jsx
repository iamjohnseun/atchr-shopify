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
  Image,
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
    navigate("/app/settings");
  };

  return (
    <Page>
      <TitleBar title="Atchr Messaging" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400" padding="500">
                <InlineStack gap="500" align="center">
                  <Box width="80px">
                    <Image
                      source="/images/icon.png"
                      alt="Atchr Messaging"
                    />
                  </Box>
                  <Text variant="headingLg">Integrate Atchr Messaging</Text>
                </InlineStack>
                
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
                
                <Box paddingBlockStart="400">
                  <BlockStack gap="300">
                    <Text variant="headingMd">Getting Started</Text>
                    <List type="number">
                      <List.Item>Go to the Settings page</List.Item>
                      <List.Item>Enter your Atchr embed code</List.Item>
                      <List.Item>Save your settings</List.Item>
                      <List.Item>Atchr widget will be visible in store</List.Item>
                    </List>
                  </BlockStack>
                </Box>
                
                <Box paddingBlockStart="400">
                  <InlineStack gap="300">
                    <Button primary onClick={handleConfigureClick}>
                      Configure Atchr Messaging
                    </Button>
                    <Button url="https://atchr.com" external>
                      Get Atchr Account
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
                    <List.Item>AI-powered chatbot capabilities</List.Item>
                    <List.Item>Instant messaging for real-time customer support</List.Item>
                    <List.Item>Real-time visitor reports & analytics.</List.Item>
                    <List.Item>Real-time website monitoring</List.Item>
                  </List>
                </BlockStack>
              </Card>
              
              <Card>
                <BlockStack gap="200" padding="400">
                  <Text variant="headingMd">Resources</Text>
                  <List>
                    <List.Item>
                      <Link url="https://atchr.com/download" external>
                        Download
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link url="https://atchr.com/support" external>
                        Documentation
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link url="mailto:support@chromesque.com" external>
                        Contact Support
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link url="https://atchr.com/terms" external>
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
