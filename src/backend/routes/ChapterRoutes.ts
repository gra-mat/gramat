import express from 'express';
import { ChapterController } from '../controllers/ChapterController.ts';

export const chapterRoutes = (chapterController: ChapterController): express.Router => {
  const router: express.Router = express.Router();

  router.get('/list', chapterController.getChapterList);
  

  router.get('/:id', chapterController.getChapterById);

  return router;
};