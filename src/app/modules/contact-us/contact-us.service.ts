/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../db/db.config';

const create = async (payload: any) => {
  const { image, images, ...rest } = payload;
  delete rest.id; // Removed id from rest so it doesn't try to insert it with Prisma directly below

  // Parse images if frontend sends "images" (matching hero-area parser)
  let parsedImage = image;
  if (!parsedImage && images !== undefined) {
    let rawImages = images;
    if (typeof rawImages === 'string') {
      try { rawImages = JSON.parse(rawImages); } catch { rawImages = [rawImages]; }
    }
    if (Array.isArray(rawImages) && rawImages.length > 0) {
      const img = rawImages[0];
      parsedImage = typeof img === 'string' ? img : img.image || '';
    }
  }

  const existing = await prisma.contactUs.findFirst();
  if (existing) {
    // If exists, update the existing record
    return prisma.contactUs.update({
      where: { id: existing.id },
      data: {
        ...rest,
        image: parsedImage !== undefined ? parsedImage : existing.image,
      },
    });
  }

  // If not exists, create new
  return prisma.contactUs.create({
    data: {
      ...rest,
      id: payload.id ? String(payload.id) : undefined,
      image: parsedImage,
    },
  });
};

const getAll = async () => {
  return prisma.contactUs.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const getById = async (id: string) => {
  return prisma.contactUs.findUniqueOrThrow({
    where: { id },
  });
};

const update = async (id: string, payload: any) => {
  const currentContactUs = await prisma.contactUs.findUnique({
    where: { id },
  });

  if (!currentContactUs) throw new Error('ContactUs not found');

  const { image, images, ...rest } = payload;
  delete rest.id;

  let parsedImage = image !== undefined ? image : currentContactUs.image;

  if (images !== undefined) {
    let rawImages = images;
    if (typeof rawImages === 'string') {
      try { rawImages = JSON.parse(rawImages); } catch { rawImages = [rawImages]; }
    }
    if (Array.isArray(rawImages) && rawImages.length > 0) {
      const img = rawImages[0];
      parsedImage = typeof img === 'string' ? img : img.image || '';
    }
  }

  const updateData: any = { ...rest };
  updateData.image = parsedImage;

  return prisma.contactUs.update({
    where: { id },
    data: updateData,
  });
};

const deleteContactUs = async (id: string) => {
  return prisma.contactUs.delete({ where: { id } });
};

export const ContactUsService = {
  create,
  getAll,
  getById,
  update,
  delete: deleteContactUs,
};
