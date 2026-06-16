import { useEffect } from 'react';
import { useApiQuery, useApi } from '../lib/useApi';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Card, CardHeader, CardTitle, CardContent,
} from '../components/ui/Card';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '../components/ui/Table';

interface Report {
  id: string;
  postId: string;
  postTitle: string;
  reporterName: string;
  reason: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
}

interface ReportListData {
  items: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const Reports = () => {
  const { data, isLoading, refetch } = useApiQuery<ReportListData>(
    () => (api.reports.list({ status: 'PENDING' }) as any),
  );

  const { mutate: resolve, isLoading: isResolving } = useApi(
    (id: string) => (api.reports.resolve(id) as any),
    {
      successMessage: '처리완료 되었습니다',
      onSuccess: () => refetch(),
    },
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const reports = data?.items ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">신고 관리</h1>
        <p className="text-gray-600 mt-1">
          처리 대기 중인 신고 목록입니다
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            불러오는 중...
          </CardContent>
        </Card>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            처리 대기 중인 신고가 없습니다.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>신고 목록 ({data?.pagination.total ?? 0}건)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>게시글</TableHead>
                    <TableHead>신고자</TableHead>
                    <TableHead>신고 사유</TableHead>
                    <TableHead>신고일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {report.postTitle}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        {report.reporterName}
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm max-w-xs truncate">
                        {report.reason}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(report.createdAt).toLocaleDateString('ko-KR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={report.status === 'PENDING' ? 'warning' : 'success'}>
                          {report.status === 'PENDING' ? '대기중' : '처리완료'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={isResolving || report.status === 'RESOLVED'}
                          onClick={() => resolve(report.id)}
                        >
                          처리완료
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
