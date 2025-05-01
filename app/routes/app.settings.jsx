import { useState, useCallback, useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
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
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { getEmbedCode } from "../services/atchr.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const embedCode = await getEmbedCode(session.shop);
  return json({ embedCode });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  
  const formData = await request.formData();
  const embedCode = formData.get("embedCode");
  
  // Forward to the API endpoint
  const apiRequest = new Request(`${process.env.HOST}/api/embed-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ embedCode }),
  });
  
  const response = await fetch(apiRequest);
  const result = await response.json();
  
  return json({ success: true, message: "Settings saved successfully" });
};

export default function SettingsPage() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();
  
  const [embedCode, setEmbedCode] = useState(loaderData.embedCode || "");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSubmit = useCallback(() => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("embedCode", embedCode);
    submit(formData, { method: "post" });
  }, [embedCode, submit]);
  
  useEffect(() => {
    if (actionData?.success) {
      setIsSaving(false);
    }
  }, [actionData]);
  
  return (
    <Page title="Atchr Messaging Settings">
      <BlockStack gap="500">
        {actionData?.success && (
          <Banner title="Success" tone="success">
            {actionData.message}
          </Banner>
        )}
        
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <InlineStack gap="500" align="center">
                  <img 
                    src="https://atchr.com/logo.png" 
                    alt="Atchr Logo" 
                    style={{ width: "80px", height: "auto" }} 
                  />
                  <Text variant="headingLg">Widget Settings</Text>
                </InlineStack>
                
                <FormLayout>
                  <TextField
                    label="Atchr Embed Code"
                    value={embedCode}
                    onChange={setEmbedCode}
                    autoComplete="off"
                    helpText="Enter your Atchr embed code from your Atchr dashboard."
                  />
                  
                  <Button 
                    primary 
                    onClick={handleSubmit} 
                    loading={isSaving}
                  >
                    Save
                  </Button>
                </FormLayout>
                
                <Box paddingBlockStart="400">
                  <Text>
                    To get your Atchr embed code, register at{" "}
                    <Link url="https://atchr.com" external>
                      atchr.com
                    </Link>
                  </Text>
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
