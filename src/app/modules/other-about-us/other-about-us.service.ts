/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../db/db.config';

const create = async (payload: any) => {
  const { image, images, ...rest } = payload;
  delete rest.id;

  // Parse images if frontend sends "images"
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

  // Check if a OthersAboutSection record already exists
  const existing = await prisma.othersAboutSection.findFirst();
  if (existing) {
    // If exists, update the existing record
    return prisma.othersAboutSection.update({
      where: { id: existing.id },
      data: {
        ...rest,
        image: parsedImage !== undefined ? parsedImage : existing.image,
      },
    });
  }
  
  // If not exists, create new
  return prisma.othersAboutSection.create({
    data: {
      ...rest,
      image: parsedImage,
    },
  });
};


const getOtherAboutUsFromDB = async () => {
  const response = await prisma.othersAboutSection.findFirst({
    orderBy: { createdAt: 'desc' },
  });
  return response;
};

const getById = async (id: string) => {
  return prisma.othersAboutSection.findUniqueOrThrow({ where: { id } });
};

const update = async (id: string, payload: any) => {
  const existing = await prisma.othersAboutSection.findUniqueOrThrow({ where: { id } });
  
  const { image, images, ...rest } = payload;
  delete rest.id;

  let parsedImage = image !== undefined ? image : existing.image;

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

  return prisma.othersAboutSection.update({
    where: { id },
    data: {
      ...rest,
      image: parsedImage,
    },
  });
};

const deleteOtherAboutUs = async (id: string) => {
  return prisma.othersAboutSection.delete({ where: { id } });
};

export const OtherAboutUsService = {
  create,
  getOtherAboutUsFromDB,
  getById,
  update,
  delete: deleteOtherAboutUs,
};
