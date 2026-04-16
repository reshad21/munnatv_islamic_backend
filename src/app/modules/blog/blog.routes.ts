import { Router } from "express";
import auth from "../../middlewares/authorization";
import validation from "../../middlewares/validation";
import { BlogController } from "./blog.controller";
import { BlogValidation } from "./blog.validation";
import { featureNames } from "../../constant/seedRoleData";

const router = Router();

router.post(
  '/',
  auth([featureNames.blogs]),
  validation(BlogValidation.createBlogValidation),
  BlogController.createBlog,
);

router.get('/', BlogController.getAllBlogs);

router.patch(
  '/:id/status',
  auth([featureNames.blogs]),
  BlogController.updateBlogStatus,
);

router.get('/:id', BlogController.getBlogById);

router.put(
  '/:id',
  auth([featureNames.blogs]),
  validation(BlogValidation.updateBlogValidation),
  BlogController.updateBlog,
);

router.delete(
  '/:id',
  auth([featureNames.blogs]),
  BlogController.deleteBlog,
);

export const BlogRoutes = router;