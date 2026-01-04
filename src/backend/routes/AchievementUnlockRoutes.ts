import express from 'express';
import { AchievementUnlockController } from '../controllers/AchievementUnlockController.ts';

export const achievementUnlockRoutes = (achievementUnlockController: AchievementUnlockController): express.Router => {
  const router: express.Router = express.Router();

  router.get('/', achievementUnlockController.getAchievementUnlockByAchievementIdAndUserId);

  return router;
};