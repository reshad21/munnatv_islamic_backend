
import { Router } from 'express';
import auth from '../../middlewares/authorization';
import { featureNames } from '../../constant/seedRoleData';
import validation from '../../middlewares/validation';
import { createReviewSchema, updateReviewSchema } from './review.validation';
import { ReviewController } from './review.controller';

const router = Router();

router.post(
	'/',
	auth([featureNames.reviews]),
	validation(createReviewSchema),
	ReviewController.createReview,
);

router.get('/', ReviewController.getAllReviews);

router.patch(
	'/:id/status',
	auth([featureNames.reviews]),
	ReviewController.updateReviewStatus,
);

router.get('/:id', ReviewController.getReviewById);

router.put(
	'/:id',
	auth([featureNames.reviews]),
	validation(updateReviewSchema),
	ReviewController.updateReview,
);

router.delete(
	'/:id',
	auth([featureNames.reviews]),
	ReviewController.deleteReview,
);

export const ReviewRoutes = router;
