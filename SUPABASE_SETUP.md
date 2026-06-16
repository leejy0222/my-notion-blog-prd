# Supabase 설정 가이드

## 1단계: Supabase 회원가입 및 프로젝트 생성

### 1. Supabase 접속
- https://supabase.com 방문
- "Start your project" 클릭
- GitHub 또는 이메일로 가입

### 2. 새 프로젝트 생성
- "New Project" 클릭
- **Organization**: 새로 생성 (예: "RPA Platform")
- **Project name**: `rpa-project` (원하는 이름)
- **Database Password**: 복잡한 비밀번호 설정 (예: `Abcd1234!@#$%^&*`)
- **Region**: Singapore 또는 가까운 지역
- "Create new project" 클릭

### 3. 프로젝트 대기
- 프로젝트 생성에 2~3분 소요
- 완료되면 대시보드로 자동 이동

---

## 2단계: Connection String 복사

### 1. 대시보드에서 설정 열기
- 좌측 메뉴 → "Settings" → "Database"

### 2. Connection String 복사
- "Connection string" 섹션에서 **PostgreSQL** 탭 선택
- "URI" 항목의 전체 문자열 복사

**형식:** `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres`

---

## 3단계: .env 파일 설정

### 1. 파일 열기
```bash
cd apps/backend
```

### 2. .env 파일 수정
```env
# Supabase Connection String 붙여넣기
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[YOUR_HOST]:[PORT]/postgres"

PORT=3000
NODE_ENV=development

JWT_SECRET=dev-secret-key-at-least-32-characters-long
JWT_EXPIRATION=24h
```

### 예시:
```env
DATABASE_URL="postgresql://postgres:Abcd1234!@#$%^&*@db.qwerty.supabase.co:5432/postgres"
PORT=3000
NODE_ENV=development
JWT_SECRET=my-secret-key-dev-env-at-least-32-chars
JWT_EXPIRATION=24h
```

---

## 4단계: Prisma 마이그레이션 실행

```bash
cd apps/backend

# 마이그레이션 실행 (Post, Report 모델 생성)
npx prisma migrate deploy

# 또는 (새로운 마이그레이션 생성하면서 실행)
npx prisma migrate dev --name add-post-report
```

**성공 메시지:**
```
The following migration(s) have been applied:

migrations/
  └─ 20260617000000_add_post_report/
    └─ migration.sql
```

---

## 5단계: 테스트 데이터 생성

### 방법 1: Prisma Studio (UI 사용 - 추천)

```bash
cd apps/backend
npx prisma studio
```

- 브라우저에서 http://localhost:5555 열림
- 각 테이블에 데이터 추가

**추가할 데이터:**

#### User (관리자)
```
email: admin@test.com
password: Admin123!  (실제로는 해시되어야 함 - 나중에 수정)
name: 관리자
role: ADMIN
isActive: true
```

#### Post (게시글)
```
title: 테스트 게시글
content: 이것은 테스트용 게시글입니다
authorId: [위에서 생성한 User의 id]
```

#### Report (신고)
```
postId: [위에서 생성한 Post의 id]
reporterId: [User의 id]
reason: 부적절한 콘텐츠입니다
status: PENDING
```

### 방법 2: Supabase 대시보드 (직접 입력)

1. Supabase 대시보드 접속
2. 좌측 메뉴 → "SQL Editor"
3. 다음 SQL 실행:

```sql
-- User 생성
INSERT INTO "User" (id, email, password, name, role, "isActive", "createdAt", "updatedAt")
VALUES (
  'user-123',
  'admin@test.com',
  'Admin123!',
  '관리자',
  'ADMIN',
  true,
  NOW(),
  NOW()
);

-- Post 생성
INSERT INTO "Post" (id, title, content, "authorId", "createdAt", "updatedAt")
VALUES (
  'post-123',
  '테스트 게시글',
  '이것은 테스트용 게시글입니다',
  'user-123',
  NOW(),
  NOW()
);

-- Report 생성
INSERT INTO "Report" (id, "postId", "reporterId", reason, status, "createdAt", "updatedAt")
VALUES (
  'report-123',
  'post-123',
  'user-123',
  '부적절한 콘텐츠입니다',
  'PENDING',
  NOW(),
  NOW()
);
```

---

## 6단계: 로컬 개발 시작

```bash
# 루트 디렉토리로 이동
cd /c/workspace/claude-code-mastery/notion-cms-project

# 백엔드 + 프론트엔드 동시 실행
pnpm dev
```

**접속 주소:**
- 프론트엔드: http://localhost:5173
- 백엔드 API: http://localhost:3000
- Prisma Studio: http://localhost:5555

---

## 7단계: 기능 테스트

### 프론트엔드에서

1. http://localhost:5173 접속
2. 회원가입 또는 로그인
   - 이메일: `admin@test.com`
   - 비밀번호: `Admin123!`
3. 로그인 성공 후 네비게이션 메뉴 확인
   - ADMIN 계정이면 "신고 관리" 링크 표시
4. "신고 관리" 클릭
5. 신고 목록 확인
6. "처리완료" 버튼 클릭 → 상태 변경 확인

### 백엔드 API 테스트 (curl)

```bash
# JWT 토큰 얻기 (로그인)
curl -X POST http://localhost:3000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Admin123!"}'

# 응답에서 token 값 복사

# 신고 목록 조회
curl -X GET "http://localhost:3000/api/reports?status=PENDING" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 신고 처리완료
curl -X PATCH "http://localhost:3000/api/reports/report-123/resolve" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎉 완료!

모든 설정이 완료되었습니다. 개발을 시작할 수 있습니다!

**문제 발생 시:**
- Supabase 대시보드에서 로그 확인
- `npx prisma studio`로 데이터베이스 상태 확인
