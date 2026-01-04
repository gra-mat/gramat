import express from 'express';
import { FeedbackController } from '../controllers/FeedbackController.ts';

export const feedbackRoutes = (feedbackController: FeedbackController): express.Router => {
  const router: express.Router = express.Router();

  router.get('/:id', feedbackController.getFeedbackById);

  return router;
};