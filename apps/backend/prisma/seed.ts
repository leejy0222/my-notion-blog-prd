import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 기존 데이터 삭제
  await prisma.report.deleteMany();
  await prisma.post.deleteMany();
  await prisma.execution.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.user.deleteMany();

  // 사용자 생성
  const admin = await prisma.user.create({
    data: {
      email: 'admin@test.com',
      password: 'Admin123!', // 실제로는 해시되어야 함
      name: '관리자',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@test.com',
      password: 'User123!',
      name: '일반사용자',
      role: 'USER',
      isActive: true,
    },
  });

  console.log('✅ Users created:', { admin: admin.email, user: user.email });

  // 게시글 생성
  const post1 = await prisma.post.create({
    data: {
      title: '테스트 게시글 1',
      content: '이것은 첫 번째 테스트 게시글입니다. 부적절한 콘텐츠가 포함되어 있습니다.',
      authorId: user.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: '테스트 게시글 2',
      content: '이것은 두 번째 테스트 게시글입니다.',
      authorId: admin.id,
    },
  });

  console.log('✅ Posts created:', [post1.title, post2.title]);

  // 신고 생성
  const report1 = await prisma.report.create({
    data: {
      postId: post1.id,
      reporterId: admin.id,
      reason: '부적절한 콘텐츠',
      status: 'PENDING',
    },
  });

  const report2 = await prisma.report.create({
    data: {
      postId: post1.id,
      reporterId: user.id,
      reason: '스팸성 글',
      status: 'PENDING',
    },
  });

  const report3 = await prisma.report.create({
    data: {
      postId: post2.id,
      reporterId: user.id,
      reason: '중복 게시',
      status: 'RESOLVED',
    },
  });

  console.log('✅ Reports created:', [report1.reason, report2.reason, report3.reason]);

  console.log('\n✨ Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`- Users: 2`);
  console.log(`- Posts: 2`);
  console.log(`- Reports: 3 (PENDING: 2, RESOLVED: 1)`);
  console.log('\n🔐 Test Account:');
  console.log(`- Email: admin@test.com`);
  console.log(`- Password: Admin123!`);
  console.log(`- Role: ADMIN`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
