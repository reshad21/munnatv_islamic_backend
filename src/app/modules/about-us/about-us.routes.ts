import { Router } from 'express';
import { featureNames } from '../../constant/seedRoleData';
import auth from '../../middlewares/authorization';
import { AboutUsController } from './about-us.controller';

const router = Router();

router.post(
  '/',
  auth([featureNames.settings]),
  AboutUsController.createAboutSection
);

router.get('/', AboutUsController.getAllAboutSections);

router.get('/:id', AboutUsController.getAboutSectionById);

router.put(
  '/:id',
  auth([featureNames.settings]),
  AboutUsController.updateAboutSection
);

router.delete(
  '/:id',
  auth([featureNames.settings]),
  AboutUsController.deleteAboutSection
);

export const AboutUsRoutes = router;
