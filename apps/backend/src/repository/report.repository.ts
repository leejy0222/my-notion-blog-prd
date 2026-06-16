import { PrismaClient, ReportStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class ReportRepository {
  async findAll(
    status?: ReportStatus,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          post: { select: { title: true } },
          reporter: { select: { name: true } },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        post: { select: { title: true } },
        reporter: { select: { name: true } },
      },
    });
  }

  async updateStatus(id: string, status: ReportStatus) {
    return prisma.report.update({
      where: { id },
      data: { status },
      include: {
        post: { select: { title: true } },
        reporter: { select: { name: true } },
      },
    });
  }
}

export const reportRepository = new ReportRepository();
