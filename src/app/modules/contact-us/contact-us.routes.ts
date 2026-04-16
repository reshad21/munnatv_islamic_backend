// ContactUs Routes
import { Router } from 'express';
import { featureNames } from '../../constant/seedRoleData';
import auth from '../../middlewares/authorization';
import validateRequest from '../../middlewares/validation';
import { ContactUsController } from './contact-us.controller';
import validation from './contact-us.validation';

const router = Router();

router.post(
  '/',
  auth([featureNames.settings]),
  validateRequest(validation.create),
  ContactUsController.createContactUs,
);

router.get('/', ContactUsController.getAllContactUs);

router.get('/:id', ContactUsController.getContactUsById);

router.put(
  '/:id',
  auth([featureNames.settings]),
  validateRequest(validation.update),
  ContactUsController.updateContactUs,
);

router.delete('/:id', ContactUsController.deleteContactUs);

export const ContactUsRoutes = router;
