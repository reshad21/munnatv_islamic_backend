/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from '../../../db/db.config';
import { builderQuery } from '../../builders/prismaBuilderQuery';

const create = async (payload: any) => {
  let status = payload.status;
  if (typeof status === 'string') {
    status = status === 'true' || status === '1';
  } else if (typeof status !== 'boolean') {
    status = undefined;
  }
  return prisma.service.create({
    data: {
      ...payload,
      status: status,
      id: payload.id ? String(payload.id) : undefined,
    },
  });
};


const getAll = async (query: Record<string, any>) => {
  const servicesQuery = builderQuery({
    searchFields: ['title', 'description', 'shortDescription'],
    searchTerm: query.searchTerm,
    filter: query.filter ? JSON.parse(query.filter) : {},
    orderBy: query.orderBy ? JSON.parse(query.orderBy) : { createdAt: 'desc' },
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 10,
  });

  const totalServices = await prisma.service.count({ where: servicesQuery.where });
  const currentPage = Number(query.page) || 1;
  const totalPages = Math.ceil(totalServices / servicesQuery.take);

  const response = await prisma.service.findMany({
    ...servicesQuery,
  });

  return {
    meta: {
      totalItems: totalServices,
      totalPages,
      currentPage,
    },
    data: response,
  };
};

const getById = async (id: string) => {
  return prisma.service.findUniqueOrThrow({ where: { id } });
};


const update = async (id: string, payload: any) => {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Service not found');
  }
  const imageValue = payload.image !== undefined ? payload.image : existing.image;
  const data = {
    ...payload,
    image: imageValue,
    status: payload.status !== undefined ? Boolean(payload.status) : undefined,
  };
  return prisma.service.update({
    where: { id },
    data,
  });
};

const deleteService = async (id: string) => {
  return prisma.service.delete({ where: { id } });
};

const updateStatus = async (id: string, status: boolean) => {
  return prisma.service.update({
    where: { id },
    data: { status: Boolean(status) },
  });
};

export const ServiceService = {
  create,
  getAll,
  getById,
  update,
  delete: deleteService,
  updateStatus,
};
