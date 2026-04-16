/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../db/db.config';

const create = async (payload: any) => {
  const { images, ...rest } = payload;
  
  let parsedImages = images || [];
  if (typeof parsedImages === 'string') {
    try { parsedImages = JSON.parse(parsedImages); } catch { parsedImages = [parsedImages]; }
  }

  // Upsert or Create HeroSection with images
  // (In your logic it looks like an ordinary create, but hero often is upserted if one already exists - keeping as create to match existing method)
  return prisma.heroSection.create({
    data: {
      ...rest,
      id: payload.id ? String(payload.id) : undefined,
      images: parsedImages.length > 0 ? {
        create: parsedImages.map((img: any) =>
          typeof img === 'string' ? { image: img } : { image: img.image || '' }
        ),
      } : undefined,
    },
    include: { images: true },
  });
};

const getAll = async () => {
  return prisma.heroSection.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getById = async (id: string) => {
  return prisma.heroSection.findUniqueOrThrow({
    where: { id },
    include: { images: true },
  });
};

const update = async (id: string, payload: any) => {
  const currentHero = await prisma.heroSection.findUnique({
    where: { id },
    include: { images: true },
  });
  
  if (!currentHero) throw new Error('HeroSection not found');

  const { images, ...rest } = payload;
  delete rest.id;

  let parsedImages = images !== undefined ? images : currentHero.images;
  if (typeof parsedImages === 'string') {
    try { parsedImages = JSON.parse(parsedImages); } catch { parsedImages = [parsedImages]; }
  }

  const updateData: any = { ...rest };

  if (images !== undefined) {
    updateData.images = {
      deleteMany: {},
      create: Array.isArray(parsedImages) ? parsedImages.map((img: any) =>
        typeof img === 'string' ? { image: img } : { image: img.image || '' }
      ) : []
    };
  }

  // Update HeroSection details
  return prisma.heroSection.update({
    where: { id },
    data: updateData,
    include: { images: true },
  });
};

const deleteHeroSection = async (id: string) => {
  // Delete all images first
  const hero = await prisma.heroSection.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!hero) throw new Error('HeroSection not found');
  for (const img of hero.images) {
    await prisma.heroImages.delete({ where: { id: img.id } });
    // Optionally delete image file from storage if needed
  }
  return prisma.heroSection.delete({ where: { id } });
};

export const HeroAreaService = {
  create,
  getAll,
  getById,
  update,
  delete: deleteHeroSection,
};
