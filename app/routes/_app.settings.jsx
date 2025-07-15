import { useState, useCallback, useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Button,
  Text,
  Banner,
  Link,
  BlockStack,
  InlineStack,
  Box,
  List,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getEmbedCode, saveEmbedCode } from "../atchr.server";

export function ErrorBoundary() {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>Please refresh the page and try again.</p>
    </div>
  );
}

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const embedCode = await getEmbedCode(admin);
  return json({ 
    embedCode, 
    shop: session.shop,
    defaultWidgetId: process.env.ATCHR_DEFAULT_WIDGET_ID,
    appUrl: process.env.SHOPIFY_APP_URL
  });
};

export const action = async ({ request }) => {
  try {
    const { session, admin } = await authenticate.admin(request);
    
    const formData = await request.formData();
    const embedCode = formData.get("embedCode");
    
    if (!embedCode || embedCode.trim() === "") {
      return json(
        { 
          error: "Entity ID is required. Please enter your Atchr entity ID.",
          success: false 
        },
        { status: 400 }
      );
    }
    
    const trimmedCode = embedCode.trim();
    
    if (trimmedCode.length < 8) {
      return json(
        { 
          error: "Entity ID appears to be too short. Please check your Atchr dashboard for the correct ID.",
          success: false 
        },
        { status: 400 }
      );
    }
    
    const sanitizedCode = trimmedCode.replace(/[<>'"]/g, '');
    
    if (sanitizedCode !== trimmedCode) {
      return json(
        { 
          error: "Entity ID contains invalid characters. Please remove any quotes or brackets.",
          success: false 
        },
        { status: 400 }
      );
    }
    
    await saveEmbedCode(admin, sanitizedCode);
    
    return json({ 
      success: true, 
      message: "You can now activate and use the Atchr Chat Widget app embed in your theme." 
    });
    
  } catch (error) {
    console.error("Failed to save embed code:", error);
    return json(
      { 
        error: "Failed to save Entity ID. Please try again.",
        success: false 
      },
      { status: 500 }
    );
  }
};

export default function SettingsPage() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();
  
  const [embedCode, setEmbedCode] = useState(loaderData?.embedCode || "");
  const [hasChanges, setHasChanges] = useState(false);
  
  const isSubmitting = navigation.state === "submitting";
  const isLoading = navigation.state === "loading";
  
  const handleEmbedCodeChange = useCallback((value) => {
    setEmbedCode(value);
    setHasChanges(value !== (loaderData?.embedCode || ""));
  }, [loaderData?.embedCode]);
  
  const handleSubmit = useCallback(() => {
    if (!embedCode.trim()) {
      return;
    }
    
    const formData = new FormData();
    formData.append("embedCode", embedCode);
    submit(formData, { method: "post" });
  }, [embedCode, submit]);
  
  const handleUseDefault = useCallback(() => {
    if (loaderData?.defaultWidgetId) {
      setEmbedCode(loaderData.defaultWidgetId);
      setHasChanges(loaderData.defaultWidgetId !== (loaderData?.embedCode || ""));
    }
  }, [loaderData?.defaultWidgetId, loaderData?.embedCode]);
  
  useEffect(() => {
    if (actionData?.success) {
      setHasChanges(false);
    }
  }, [actionData]);
  
  useEffect(() => {
    if (loaderData?.embedCode !== undefined) {
      setEmbedCode(loaderData.embedCode || "");
      setHasChanges(false);
    }
  }, [loaderData?.embedCode]);
  
  return (
    <Page fullWidth>
      <TitleBar title="Atchr Messaging Settings" />
      <BlockStack gap="500">
        {actionData?.error && (
          <Banner title="Error" tone="critical">
            {actionData.error}
          </Banner>
        )}

        {actionData?.success && (
          <Banner title="Success" tone="success">
            {actionData.message}
          </Banner>
        )}

        {loaderData?.error && (
          <Banner title="Warning" tone="warning">
            {loaderData.error}
          </Banner>
        )}

        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500" padding="500">
                <FormLayout>
                  <TextField
                    label="Atchr Entity ID"
                    value={embedCode}
                    onChange={handleEmbedCodeChange}
                    autoComplete="off"
                    disabled={isSubmitting || isLoading}
                    helpText="Enter your unique Atchr entity ID from your dashboard."
                    placeholder="e.g., abc123-def456-ghi789"
                    error={
                      actionData?.error && !actionData?.success ? true : false
                    }
                  />

                  <InlineStack gap="300" align="start" blockAlign="center">
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      loading={isSubmitting}
                      disabled={
                        isSubmitting ||
                        isLoading ||
                        !hasChanges ||
                        !embedCode.trim()
                      }
                    >
                      {isSubmitting ? "Saving..." : "Save Entity ID"}
                    </Button>

                    {/* {loaderData?.defaultWidgetId && (
                      <Button
                        onClick={handleUseDefault}
                        disabled={isSubmitting || isLoading}
                      >
                        Use Default ID
                      </Button>
                    )} */}

                    {hasChanges && (
                      <Text variant="bodySm" tone="subdued">
                        You have unsaved changes
                      </Text>
                    )}
                  </InlineStack>
                </FormLayout>

                {embedCode && (
                  <Box paddingBlockStart="400">
                    <Banner title="Next Steps" tone="info">
                      <BlockStack gap="200">
                        <Text>
                          You can now add the chat widget to your theme:
                        </Text>
                        <List type="number">
                          <List.Item>
                            Go to <strong>Online Store → Themes</strong>
                          </List.Item>
                          <List.Item>
                            Click <strong>Customize</strong> on your active
                            theme
                          </List.Item>
                          <List.Item>
                            In the theme editor, click{" "}
                            <strong>App embeds</strong>
                          </List.Item>
                          <List.Item>
                            Search and activate{" "}
                            <strong>"Atchr Messaging"</strong>
                          </List.Item>
                          <List.Item>Save your theme</List.Item>
                        </List>

                        <Text variant="bodySm" tone="subdued">
                          <strong>Note:</strong> The widget will use the Entity
                          ID configured here by default.
                          <br />
                          You can optionally override it with a different Entity
                          ID in the theme editor settings.
                        </Text>
                      </BlockStack>
                    </Banner>
                  </Box>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="300" padding="400">
                  <Text variant="headingMd">Instructions</Text>
                  <List>
                    <List.Item>
                      Enter your Entity ID in this admin panel
                    </List.Item>
                    <List.Item>
                      Navigate to Online Store → Themes → Customize
                    </List.Item>
                    <List.Item>Select "App embeds" from menu</List.Item>
                    <List.Item>Search & Activate "Atchr Messaging"</List.Item>
                    <List.Item>Save your theme</List.Item>
                  </List>
                </BlockStack>
              </Card>
              {!embedCode && (
                <Card>
                  <BlockStack gap="300" padding="400">
                    <Text variant="headingMd">Find Your Entity ID</Text>
                    <List>
                      <List.Item>
                        Open{" "}
                        <Link
                          url="https://dashboard.atchr.com"
                          external
                          target="_blank"
                        >
                          Atchr Dashboard
                        </Link>
                      </List.Item>
                      <List.Item>Navigate to Entities</List.Item>
                      <List.Item>Select your entity</List.Item>
                      <List.Item>Copy your entity ID</List.Item>
                    </List>
                  </BlockStack>
                </Card>
              )}

              <Card>
                <BlockStack gap="300" padding="400">
                  <Text variant="headingMd">Need Help?</Text>
                  <List>
                    <List.Item>
                      <Link
                        url="https://atchr.com/register"
                        external
                        target="_blank"
                      >
                        Create an account
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link
                        url="https://atchr.com/integrations/shopify"
                        external
                        target="_blank"
                      >
                        Shopify Integration
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link
                        url="https://atchr.com/support"
                        external
                        target="_blank"
                      >
                        Documentation
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link
                        url="mailto:support@chromesque.com"
                        external
                        target="_blank"
                      >
                        Contact Support
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
