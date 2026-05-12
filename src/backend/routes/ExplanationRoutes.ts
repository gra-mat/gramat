import express from 'express';
import { ExplanationController } from '../controllers/ExplanationController.ts';

export const explanationRoutes = (explanationController: ExplanationController): express.Router => {
  const router: express.Router = express.Router();

  router.get('/:id', explanationController.getExplanationById);

  return router;
};