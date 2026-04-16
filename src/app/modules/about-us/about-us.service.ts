/* eslint-disable @typescript-eslint/no-explicit-any */

// import { AboutUs, AboutUsImages } from '@prisma/client';
import prisma from '../../../db/db.config';




const createAboutUsIntoDB = async (payload: any) => {
  const { images, ...rest } = payload;
  
  let parsedImages = images || [];
  if (typeof parsedImages === 'string') {
    try { parsedImages = JSON.parse(parsedImages); } catch { parsedImages = [parsedImages]; }
  }

  const response = await prisma.aboutUs.create({
    data: {
      ...rest,
      id: payload.id ? String(payload.id) : undefined,
      aboutUsImages: parsedImages.length > 0 ? {
        create: parsedImages.map((img: any) =>
          typeof img === 'string' ? { image: img } : { image: img.image || '' }
        ),
      } : undefined,
    },
    include: {
      aboutUsImages: true,
    },
  });
  return response;
};


const getAboutUsFromDB = async () => {
  const response = await prisma.aboutUs.findFirst({
    include: {
      aboutUsImages: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return response;
};


const getById = async (id: string) => {
  return prisma.aboutUs.findUniqueOrThrow({
    where: { id },
    include: { aboutUsImages: true },
  });
};

const update = async (
  id: string,
  payload: any
) => {
  if (!id) {
    throw new Error('AboutUs id is required for update');
  }

  const currentAboutUs = await prisma.aboutUs.findUnique({
    where: { id },
    include: { aboutUsImages: true },
  });

  if (!currentAboutUs) {
    throw new Error('AboutUs not found');
  }

  const { images, ...rest } = payload;
  delete rest.id;

  let parsedImages = images !== undefined ? images : currentAboutUs.aboutUsImages;
  if (typeof parsedImages === 'string') {
    try { parsedImages = JSON.parse(parsedImages); } catch { parsedImages = [parsedImages]; }
  }

  const updateData: any = { ...rest };

  if (images !== undefined) {
    updateData.aboutUsImages = {
      deleteMany: {},
      create: Array.isArray(parsedImages) ? parsedImages.map((img: any) =>
        typeof img === 'string' ? { image: img } : { image: img.image || '' }
      ) : []
    };
  }

  // Update AboutUs details
  return prisma.aboutUs.update({
    where: { id },
    data: updateData,
    include: { aboutUsImages: true },
  });
};

const deleteAboutUs = async (id: string) => {
  // Delete all images first
  const aboutUs = await prisma.aboutUs.findUnique({
    where: { id },
    include: { aboutUsImages: true },
  });
  if (!aboutUs) throw new Error('AboutUs not found');
  for (const img of aboutUs.aboutUsImages) {
    await prisma.aboutUsImages.delete({ where: { id: img.id } });
  }
  return prisma.aboutUs.delete({ where: { id } });
};

export const AboutUsService = {
  create: createAboutUsIntoDB,
  getAll: getAboutUsFromDB,
  getById,
  update,
  delete: deleteAboutUs,
};
