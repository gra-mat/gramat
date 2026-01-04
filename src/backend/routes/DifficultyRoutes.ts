import express from 'express';
import { DifficultyController } from '../controllers/DifficultyController.ts';

export const difficultyRoutes = (difficultyController: DifficultyController): express.Router => {
  const router: express.Router = express.Router();

  router.get('/:id', difficultyController.getDifficultyById);

  return router;
};