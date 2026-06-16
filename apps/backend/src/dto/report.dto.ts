import { z } from 'zod';

export const ListReportsQuerySchema = z.object({
  status: z.enum(['PENDING', 'RESOLVED']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type ListReportsQuery = z.infer<typeof ListReportsQuerySchema>;

export interface ReportResponseDto {
  id: string;
  postId: string;
  postTitle: string;
  reporterName: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
}

export interface ReportListResponseDto {
  items: ReportResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
