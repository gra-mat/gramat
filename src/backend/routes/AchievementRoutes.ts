import express from 'express';
import { AchievementController } from '../controllers/AchievementController.ts';

export const achievementRoutes = (achievementController: AchievementController): express.Router => {
  const router: express.Router = express.Router();

  router.get('/:id', achievementController.getAchievementById);

  return router;
};