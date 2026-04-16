import prisma from '../../../db/db.config';
import { builderQuery } from '../../builders/prismaBuilderQuery';

const create = async (payload: any) => {
  let status = payload.status;
  if (typeof status === 'string') {
    status = status === 'true' || status === '1';
  } else if (typeof status !== 'boolean') {
    status = undefined;
  }
  const { thumbnail, ...rest } = payload;
  return prisma.fivePillar.create({
    data: {
      ...rest,
      image: thumbnail || payload.image,
      order: payload.order ? Number(payload.order) : undefined,
      status: status,
      id: payload.id ? String(payload.id) : undefined,
    },
  });
};

const getAll = async (query: Record<string, any>) => {
  const pillarsQuery = builderQuery({
    searchFields: ['title', 'description'],
    searchTerm: query.searchTerm,
    filter: query.filter ? JSON.parse(query.filter) : {},
    orderBy: query.orderBy ? JSON.parse(query.orderBy) : { order: 'asc' },
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 10,
  });

  const totalPillars = await prisma.fivePillar.count({
    where: pillarsQuery.where,
  });
  const currentPage = Number(query.page) || 1;
  const totalPages = Math.ceil(totalPillars / pillarsQuery.take);

  const response = await prisma.fivePillar.findMany({
    ...pillarsQuery,
  });

  return {
    meta: {
      totalItems: totalPillars,
      totalPages,
      currentPage,
    },
    data: response,
  };
};

const getById = async (id: string) => {
  return prisma.fivePillar.findUnique({ where: { id } });
};

const update = async (id: string, payload: any) => {
  const existing = await prisma.fivePillar.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Five Pillar item not found');
  }
  const { thumbnail, ...rest } = payload;
  const imageValue = thumbnail !== undefined ? thumbnail : (payload.image !== undefined ? payload.image : existing.image);
  const data = {
    ...rest,
    image: imageValue,
    order: payload.order !== undefined ? Number(payload.order) : undefined,
    status: payload.status !== undefined ? Boolean(payload.status) : undefined,
  };
  return prisma.fivePillar.update({
    where: { id },
    data,
  });
};

const deletePillar = async (id: string) => {
  return prisma.fivePillar.delete({ where: { id } });
};

const updateStatus = async (id: string, status: boolean) => {
  const updated = await prisma.fivePillar.update({
    where: { id: String(id) },
    data: { status: Boolean(status) },
  });
  return updated;
};

export const FivePillarService = {
  create,
  getAll,
  getById,
  update,
  delete: deletePillar,
  updateStatus,
};
