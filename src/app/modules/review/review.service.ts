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
    const { thumbnail, ...rest } = payload;
    return prisma.review.create({
        data: {
            ...rest,
            image: thumbnail || payload.image,
            rating: payload.rating ? Number(payload.rating) : undefined,
            status: status,
            id: payload.id ? String(payload.id) : undefined,
        },
    });
};

const getAll = async (query: Record<string, any>) => {
    const reviewsQuery = builderQuery({
        searchFields: ['author', 'description'],
        searchTerm: query.searchTerm,
        filter: query.filter ? JSON.parse(query.filter) : {},
        orderBy: query.orderBy ? JSON.parse(query.orderBy) : { createdAt: 'desc' },
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
    });

    const totalReviews = await prisma.review.count({ where: reviewsQuery.where });
    const currentPage = Number(query.page) || 1;
    const totalPages = Math.ceil(totalReviews / reviewsQuery.take);

    const response = await prisma.review.findMany({
        ...reviewsQuery,
    });

    return {
        meta: {
            totalItems: totalReviews,
            totalPages,
            currentPage,
        },
        data: response,
    };
};

const getById = async (id: string) => {
  return prisma.review.findUniqueOrThrow({ where: { id } });
};

const update = async (id: string, payload: any) => {
    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
        throw new Error('Review item not found');
    }
    const { thumbnail, ...rest } = payload;
    const imageValue = thumbnail !== undefined ? thumbnail : (payload.image !== undefined ? payload.image : existing.image);
    const data = {
        ...rest,
        image: imageValue,
        rating: payload.rating ? Number(payload.rating) : undefined,
        status: payload.status !== undefined ? Boolean(payload.status) : undefined,
    };
    return prisma.review.update({
        where: { id },
        data,
    });
};

const deleteReview = async (id: string) => {
    return prisma.review.delete({ where: { id } });
};

const updateStatus = async (id: string, status: boolean) => {
    return prisma.review.update({
        where: { id },
        data: { status: Boolean(status) },
    });
};

export const ReviewService = {
    create,
    getAll,
    getById,
    update,
    delete: deleteReview,
    updateStatus,
};
