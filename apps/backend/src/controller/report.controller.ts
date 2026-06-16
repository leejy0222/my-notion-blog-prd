import { Response } from 'express';
import { reportService } from '../service/report.service';
import { ListReportsQuerySchema } from '../dto/report.dto';
import { AuthRequest } from '../types';
import { ApiResponse } from '@rpa/shared';

export class ReportController {
  async list(req: AuthRequest, res: Response) {
    const query = ListReportsQuerySchema.parse({
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    });

    const result = await reportService.getReports(query);

    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    return res.json(response);
  }

  async resolve(req: AuthRequest, res: Response) {
    const report = await reportService.resolveReport(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: report,
      timestamp: new Date().toISOString(),
    };

    return res.json(response);
  }
}

export const reportController = new ReportController();
