import { Router } from 'express';
import auth from '../../middlewares/authorization';
import { featureNames } from '../../constant/seedRoleData';
import validation from '../../middlewares/validation';
import { ServiceController } from './service.controller';
import { ServiceValidation } from './service.validation';

const router = Router();

router.post(
  '/',
  auth([featureNames.services]),
  validation(ServiceValidation.createServiceValidation),
  ServiceController.createService,
);

router.get('/', ServiceController.getAllServices);

router.get('/:id', ServiceController.getServiceById);

router.put(
  '/:id',
  auth([featureNames.services]),
  validation(ServiceValidation.updateServiceValidation),
  ServiceController.updateService,
);

router.delete(
  '/:id',
  auth([featureNames.services]),
  ServiceController.deleteService,
);

router.patch(
  '/:id/status',
  auth([featureNames.services]),
  ServiceController.updateServiceStatus,
);

export const ServiceRoutes = router;
