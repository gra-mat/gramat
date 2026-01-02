import express from 'express';
import { UserController } from '../controllers/UserController.ts';

export const userRoutes = (userController: UserController): express.Router => {
  const router: express.Router = express.Router();

  router.get('/logged', userController.getLoggedUser);

  router.get('/:id', userController.getUserById);

  return router;
};