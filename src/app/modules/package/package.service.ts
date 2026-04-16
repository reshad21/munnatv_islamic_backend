/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../db/db.config';
import { builderQuery } from '../../builders/prismaBuilderQuery';

const create = async (payload: any) => {
    let status = payload.status;
    if (typeof status === 'string') {
        status = status === 'true' || status === '1';
    } else if (typeof status !== 'boolean') {
        status = true;
    }

    const { images, packageImages, ...rest } = payload;
    
    let parsedImages = images || packageImages || [];
    if (typeof parsedImages === 'string') {
        try { parsedImages = JSON.parse(parsedImages); } catch { parsedImages = [parsedImages]; }
    }

    return prisma.package.create({
        data: {
            ...rest,
            status: status,
            id: payload.id ? String(payload.id) : undefined,
            packageImages: parsedImages.length > 0 ? {
                create: parsedImages.map((img: any) => 
                    typeof img === 'string' ? { image: img } : { image: img.image || '' }
                )
            } : undefined
        },
        include: { packageImages: true },
    });
};

const getAll = async (query: Record<string, any>) => {
    const packageQuery = builderQuery({
        searchFields: ['title', 'description', 'country'],
        searchTerm: query.searchTerm,
        filter: query.filter ? JSON.parse(query.filter) : {},
        orderBy: query.orderBy ? JSON.parse(query.orderBy) : { createdAt: 'desc' },
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
    });

    const totalPackages = await prisma.package.count({ where: packageQuery.where });
    const currentPage = Number(query.page) || 1;
    const totalPages = Math.ceil(totalPackages / packageQuery.take);

    const response = await prisma.package.findMany({
        ...packageQuery,
        include: { packageImages: true },
    });

    return {
        meta: {
            totalItems: totalPackages,
            itemCount: response.length,
            itemsPerPage: packageQuery.take,
            totalPages,
            currentPage,
        },
        data: response,
    };
};

const getById = async (id: string) => {
    return prisma.package.findUnique({ where: { id }, include: { packageImages: true } });
};

const update = async (id: string, payload: any) => {
    const existing = await prisma.package.findUnique({ where: { id }, include: { packageImages: true } });
    if (!existing) {
        throw new Error('Package not found');
    }

    const { images, packageImages, status, ...rest } = payload;
    delete rest.id;

    const imagesValue = images !== undefined ? images : (packageImages !== undefined ? packageImages : existing.packageImages);

    let parsedImages = imagesValue;
    if (typeof parsedImages === 'string') {
        try { parsedImages = JSON.parse(parsedImages); } catch { parsedImages = [parsedImages]; }
    }

    const data: any = {
        ...rest,
        status: status !== undefined ? Boolean(status) : undefined,
    };

    if (images !== undefined || packageImages !== undefined) {
        data.packageImages = {
            deleteMany: {},
            create: Array.isArray(parsedImages) ? parsedImages.map((img: any) =>
                typeof img === 'string' ? { image: img } : { image: img.image || '' }
            ) : []
        };
    }

    return prisma.package.update({
        where: { id },
        data,
        include: { packageImages: true },
    });
};

const deletePackage = async (id: string) => {
    return prisma.package.delete({ where: { id } });
};

const packageImageCreate = async (payload: { image: string | null; packageId?: string }) => {
    // If packageId is not provided, find the first package or throw error
    let packageId = payload.packageId;
    
    if (!packageId) {
        const firstPackage = await prisma.package.findFirst();
        if (!firstPackage) {
            throw new Error('No Package found to associate the image with.');
        }
        packageId = firstPackage.id;
    }

    const response = await prisma.packageImage.create({
        data: {
            image: payload.image || '',
            packageId: packageId,
        },
    });

    return response;
};

const deletePackageImage = async (imageId: string) => {
    return prisma.packageImage.delete({
        where: { id: imageId },
    });
};

const updateStatus = async (id: string, status: boolean) => {
  return prisma.package.update({
    where: { id },
    data: { status: Boolean(status) },
  });
};

export const PackageService = {
    create,
    getAll,
    getById,
    update,
    delete: deletePackage,
    packageImageCreate,
    deletePackageImage,
    updateStatus,
};