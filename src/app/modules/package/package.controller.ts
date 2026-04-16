import catchAsync from '../../utils/catchAsync';
// import { getMultipleImageUrls } from '../../utils/getImageUrl';
import sendResponse from '../../utils/sendResponse';
import { PackageService } from './package.service';

const createPackage = catchAsync(async (req, res) => {
    const images = req.body.images;
   
    
    const response = await PackageService.create({ ...req.body, images });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Package created successfully',
        data: response,
    });
});

const getAllPackages = catchAsync(async (req, res) => {
    const response = await PackageService.getAll(req.query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Packages retrieved successfully',
        data: response,
    });
});

const getPackageById = catchAsync(async (req, res) => {
    const response = await PackageService.getById(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Package retrieved successfully',
        data: response,
    });
});

const updatePackage = catchAsync(async (req, res) => {
    const images = req.body.images;

    const response = await PackageService.update(req.params.id, { ...req.body, images });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Package updated successfully',
        data: response,
    });
});

const deletePackage = catchAsync(async (req, res) => {
    const response = await PackageService.delete(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Package deleted successfully',
        data: response,
    });
});

const addPackageImage = catchAsync(async (req, res) => {
  const imageUrl = req.body.image;

  const response = await PackageService.packageImageCreate({
    image: imageUrl,
    packageId: req.body.packageId
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Package image added successfully',
    data: response,
  });
});

const deletePackageImage = catchAsync(async (req, res) => {
  const response = await PackageService.deletePackageImage(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Package image deleted successfully',
    data: response,
  });
});

const updatePackageStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  let status = req.body.status;
  if (typeof status === 'string') {
    status = status === 'true' || status === '1';
  }
  const response = await PackageService.updateStatus(id, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Package status updated successfully',
    data: response,
  });
});

export const PackageController = {
    createPackage,
    getAllPackages,
    getPackageById,
    updatePackage,
    deletePackage,
    addPackageImage,
    deletePackageImage,
    updatePackageStatus
};
