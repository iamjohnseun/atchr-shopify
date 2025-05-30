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

export async function deleteEmbedCode(admin) {
  // Metafields are automatically cleaned up when app is uninstalled
  // But you can implement manual deletion if needed
  return true;
}

export function getAtchrEmbedUrl(embedCode) {
  const baseUrl = process.env.ATCHR_EMBED_BASE_URL || "https://embed.atchr.com";
  return `${baseUrl}/${embedCode}`;
}
