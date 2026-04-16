import catchAsync from '../../utils/catchAsync';
// import { getMultipleImageUrls } from '../../utils/getImageUrl';
import sendResponse from '../../utils/sendResponse';
import { AboutUsService } from './about-us.service';

const createAboutSection = catchAsync(async (req, res) => {
  const images = req.body.images;
 

  const response = await AboutUsService.create({
    ...req.body,
    images: images,
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'About Us section created successfully',
    data: response,
  });
});

const getAllAboutSections = catchAsync(async (req, res) => {
  const response = await AboutUsService.getAll();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'About Us section retrieved successfully',
    data: response,
  });
});

const getAboutSectionById = catchAsync(async (req, res) => {
  const response = await AboutUsService.getById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'About Us section retrieved successfully',
    data: response,
  });
});

const updateAboutSection = catchAsync(async (req, res) => {
  const images = req.body.images;
  

  const response = await AboutUsService.update(
    req.params.id,
    { ...req.body, images }
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'About Us section updated successfully',
    data: response,
  });
});

const deleteAboutSection = catchAsync(async (req, res) => {
  const response = await AboutUsService.delete(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'About Us section deleted successfully',
    data: response,
  });
});

export const AboutUsController = {
  createAboutSection,
  getAllAboutSections,
  getAboutSectionById,
  updateAboutSection,
  deleteAboutSection,
};
