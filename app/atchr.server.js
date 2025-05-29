import prisma from "./db.server";

export async function getEmbedCode(shop) {
  const record = await prisma.atchrEmbedCode.findUnique({
    where: { shop },
  });

  return record?.embedCode || null;
}

export async function saveEmbedCode(shop, embedCode) {
  return await prisma.atchrEmbedCode.upsert({
    where: { shop },
    update: {
      embedCode,
      updatedAt: new Date(),
    },
    create: {
      shop,
      embedCode,
    },
  });
}

export async function deleteEmbedCode(shop) {
  return await prisma.atchrEmbedCode
    .delete({
      where: { shop },
    })
    .catch(() => {
      // Ignore if record doesn't exist
    });
}

export function getAtchrEmbedUrl(embedCode) {
  const baseUrl = process.env.ATCHR_EMBED_BASE_URL || "https://embed.atchr.com";
  return `${baseUrl}/${embedCode}`;
}
