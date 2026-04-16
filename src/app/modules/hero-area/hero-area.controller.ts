
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HeroAreaService } from './hero-area.service';
// import { getMultipleImageUrls } from '../../utils/getImageUrl';

const createHeroSection = catchAsync(async (req, res) => {
  const images = req.body.images;
  // if (req.files) {
  //   const imageFiles = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
  //   if (imageFiles.length > 0) {
  //     images = getMultipleImageUrls(req, imageFiles);
  //   }
  // }

  const response = await HeroAreaService.create({
    ...req.body,
    images: images,
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Hero section created successfully',
    data: response,
  });
});

const getAllHeroSections = catchAsync(async (req, res) => {
  const response = await HeroAreaService.getAll();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hero sections retrieved successfully',
    data: response,
  });
});

const getHeroSectionById = catchAsync(async (req, res) => {
  const response = await HeroAreaService.getById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hero section retrieved successfully',
    data: response,
  });
});

const updateHeroSection = catchAsync(async (req, res) => {
  const images = req.body.images;
  

  const response = await HeroAreaService.update(
    req.params.id,
    { ...req.body, images }
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hero section updated successfully',
    data: response,
  });
});

const deleteHeroSection = catchAsync(async (req, res) => {
  const response = await HeroAreaService.delete(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hero section deleted successfully',
    data: response,
  });
});

export const HeroAreaController = {
  createHeroSection,
  getAllHeroSections,
  getHeroSectionById,
  updateHeroSection,
  deleteHeroSection,
};
