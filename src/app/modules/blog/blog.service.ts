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
  return prisma.blog.create({
    data: {
      ...payload,
      status: status,
      id: payload.id ? String(payload.id) : undefined,
    },
  });
};

const getAll = async (query: Record<string, any>) => {
  const blogQuery = builderQuery({
    searchFields: ['author', 'title', 'shortDescription', 'description', 'image'],
    searchTerm: query.searchTerm,
    filter: query.filter ? JSON.parse(query.filter) : {},
    orderBy: query.orderBy ? JSON.parse(query.orderBy) : { createdAt: 'desc' },
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 10,
  });

  const totalBlogs = await prisma.blog.count({ where: blogQuery.where });
  const currentPage = Number(query.page) || 1;
  const totalPages = Math.ceil(totalBlogs / blogQuery.take);

  const response = await prisma.blog.findMany({
    ...blogQuery,
  });

  return {
    meta: {
      totalItems: totalBlogs,
      totalPages,
      currentPage,
    },
    data: response,
  };
};

const getById = async (id: string) => {
  return prisma.blog.findUniqueOrThrow({ where: { id } });
};

const update = async (id: string, payload: any) => {
  const existing = await prisma.blog.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Blog not found');
  }
  const imageValue = payload.image !== undefined ? payload.image : existing.image;
  const data = {
    ...payload,
    image: imageValue,
    status: payload.status !== undefined ? Boolean(payload.status) : undefined,
  };
  return prisma.blog.update({
    where: { id },
    data,
  });
};

const deleteBlog = async (id: string) => {
  return prisma.blog.delete({ where: { id } });
};

const updateStatus = async (id: string, status: boolean) => {
  return prisma.blog.update({
    where: { id },
    data: { status: Boolean(status) },
  });
};

export const BlogService = {
  create,
  getAll,
  getById,
  update,
  delete: deleteBlog,
  updateStatus,
};


