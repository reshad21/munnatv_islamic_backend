import express from 'express';
import { GalleryController } from './gallery.controller';
// import { GalleryValidation } from './gallery.validation'; // Uncomment if you add validation
import { featureNames } from '../../constant/seedRoleData';
import auth from '../../middlewares/authorization';

const router = express.Router();

router.post(
    '/',
    auth([featureNames.gallery]),
    GalleryController.createGallery
);

router.get('/', GalleryController.getAllGalleries);
router.get('/:id', GalleryController.getGalleryById);
router.patch(
  '/:id/status',
  GalleryController.updateGalleryStatus,
);
router.put(
    '/:id',
    GalleryController.updateGallery
);
router.delete(
    '/:id',
    auth([featureNames.gallery]),
    GalleryController.deleteGallery
);

export const GalleryRoutes = router;

