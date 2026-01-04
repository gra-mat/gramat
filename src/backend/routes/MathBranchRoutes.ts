import express from 'express';
import { MathBranchController } from '../controllers/MathBranchController.ts';

export const mathBranchRoutes = (mathBranchController: MathBranchController): express.Router => {
  const router: express.Router = express.Router();

  router.get('/list', mathBranchController.getMathBranchList);
  

  router.get('/:id', mathBranchController.getMathBranchById);

  return router;
};