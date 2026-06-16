import { reportRepository } from '../repository/report.repository';
import { ReportResponseDto, ListReportsQuery } from '../dto/report.dto';
import { AppError } from '../middleware/errorHandler';

export class ReportService {
  async getReports(query: ListReportsQuery) {
    const { status, page, limit } = query;
    const prismaStatus = status as any;

    const result = await reportRepository.findAll(prismaStatus, page, limit);

    return {
      items: result.reports.map((report) => this.toResponseDto(report)),
      pagination: result.pagination,
    };
  }

  async resolveReport(id: string) {
    const report = await reportRepository.findById(id);
    if (!report) {
      throw new AppError('NOT_FOUND', 'Report not found', 404);
    }

    if (report.status === 'RESOLVED') {
      throw new AppError('CONFLICT', 'Report is already resolved', 409);
    }

    const updated = await reportRepository.updateStatus(id, 'RESOLVED');
    return this.toResponseDto(updated);
  }

  private toResponseDto(report: any): ReportResponseDto {
    return {
      id: report.id,
      postId: report.postId,
      postTitle: report.post.title,
      reporterName: report.reporter.name,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
    };
  }
}

export const reportService = new ReportService();
