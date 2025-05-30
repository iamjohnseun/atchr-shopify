export async function getEmbedCode(admin) {
  try {
    const response = await admin.graphql(`
      query {
        currentAppInstallation {
          id
          metafields(namespace: "atchr", first: 1) {
            edges {
              node {
                key
                value
              }
            }
          }
        }
      }
    `);
    
    const data = await response.json();
    const metafields = data.data?.currentAppInstallation?.metafields?.edges || [];
    const entityField = metafields.find(edge => edge.node.key === "entity_id");
    
    return entityField?.node?.value || null;
  } catch (error) {
    console.error("Failed to get embed code:", error);
    return null;
  }
}

export async function saveEmbedCode(admin, embedCode) {
  try {
    const appResponse = await admin.graphql(`
      query {
        currentAppInstallation {
          id
        }
      }
    `);
    
    const appData = await appResponse.json();
    const appInstallationId = appData.data?.currentAppInstallation?.id;
    
    if (!appInstallationId) {
      throw new Error("Could not find app installation");
    }

    const response = await admin.graphql(`
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `, {
      variables: {
        metafields: [
          {
            namespace: "atchr",
            key: "entity_id",
            value: embedCode,
            type: "single_line_text_field",
            ownerId: appInstallationId
          }
        ]
      }
    });

    const result = await response.json();
    
    if (result.data?.metafieldsSet?.userErrors?.length > 0) {
      throw new Error(result.data.metafieldsSet.userErrors[0].message);
    }
    
    return result.data?.metafieldsSet?.metafields?.[0];
  } catch (error) {
    console.error("Failed to save embed code:", error);
    throw error;
  }
}

export async function deleteEmbedCode(shop) {
  try {
    console.log(`Cleaning up Atchr data for shop: ${shop}`);
    
    // Since we only store metafields and Shopify automatically cleans them up
    // when the app is uninstalled, we just need to log this action
    
    // If you had external storage, you would clean it up here:
    // - Database records
    // - External API calls
    // - File storage cleanup
    
    console.log(`Successfully cleaned up data for shop: ${shop}`);
    return true;
  } catch (error) {
    console.error(`Failed to cleanup data for shop ${shop}:`, error);
    throw error;
  }
}

export function getAtchrEmbedUrl(embedCode) {
  const baseUrl = process.env.ATCHR_EMBED_BASE_URL || "https://embed.atchr.com";
  return `${baseUrl}/${embedCode}`;
}
