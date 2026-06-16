import { Router, Response, NextFunction } from 'express';
import { reportController } from '../controller/report.controller';
import { authMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

const router = Router();

router.use(authMiddleware);

const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    throw new AppError('FORBIDDEN', 'Admin access required', 403);
  }
  next();
};

router.use(requireAdmin);

router.get('/', (req, res, next) =>
  reportController.list(req as any, res).catch(next),
);

router.patch('/:id/resolve', (req, res, next) =>
  reportController.resolve(req as any, res).catch(next),
);

export default router;
