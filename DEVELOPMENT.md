# 개발 환경 설정 가이드

## 프로젝트 구조

```
├── apps/
│   ├── frontend/       # React (Vite) - 포트 5173
│   └── backend/        # Express.js - 포트 3000
├── packages/
│   └── shared/         # 공유 타입 및 유틸
├── docker-compose.yml  # PostgreSQL 컨테이너
```

## 1️⃣ 사전 준비

### 필수 설치
- **Node.js 18+**
- **pnpm 8.0+** (패키지 매니저)
- **PostgreSQL 14+** 또는 Docker

### 설치 확인
```bash
node --version  # v18+
pnpm --version  # 8.0+
```

---

## 2️⃣ PostgreSQL 설정

### 옵션 A: Docker 사용 (권장 - 가장 간단)

**1. Docker Desktop 설치**
- https://www.docker.com/products/docker-desktop

**2. PostgreSQL 컨테이너 시작**
```bash
docker-compose up -d
```

**3. 상태 확인**
```bash
docker ps  # rpa_postgres 컨테이너 실행 중인지 확인
```

**4. 연결 정보**
- Host: `localhost`
- Port: `5432`
- User: `user`
- Password: `password`
- Database: `rpa_db`

---

### 옵션 B: 로컬 PostgreSQL 설치

**Windows:**
- https://www.postgresql.org/download/windows/

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu:**
```bash
sudo apt-get install postgresql postgresql-contrib
```

**데이터베이스 생성:**
```bash
psql -U postgres
CREATE DATABASE rpa_db;
CREATE USER user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE rpa_db TO user;
\q
```

---

### 옵션 C: 온라인 DB (Supabase, Railway)

**Supabase** (무료)
1. https://supabase.com 가입
2. 새 프로젝트 생성
3. Connection String 복사

---

## 3️⃣ 백엔드 설정

### .env 파일 설정

```bash
cd apps/backend
```

`.env` 파일을 생성하고 아래 내용 입력:

```env
# 데이터베이스
DATABASE_URL="postgresql://user:password@localhost:5432/rpa_db"

# 서버
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-here-min-32-chars
JWT_EXPIRATION=24h
```

### Prisma 마이그레이션

```bash
cd apps/backend

# 마이그레이션 실행 (Post, Report 모델 생성)
npx prisma migrate dev --name add-post-report

# Prisma Studio (UI로 데이터 관리)
npx prisma studio
```

---

## 4️⃣ 프로젝트 시작

### 루트 디렉토리에서

```bash
# 1. 의존성 설치
pnpm install

# 2. 개발 서버 시작 (백엔드 + 프론트엔드 동시 실행)
pnpm dev
```

### 개별 실행

```bash
# 백엔드만
pnpm --filter=@rpa/backend dev

# 프론트엔드만
pnpm --filter=@rpa/frontend dev
```

---

## 5️⃣ 테스트 데이터 생성

```bash
cd apps/backend
npx prisma studio
```

**Prisma Studio에서:**
1. User 테이블 추가
   - email: admin@test.com
   - name: 관리자
   - role: ADMIN

2. Post 테이블 추가
   - title: 테스트 게시글
   - content: 내용입니다

3. Report 테이블 추가
   - reason: 부적절한 콘텐츠
   - status: PENDING

---

## 6️⃣ 기능 테스트

### 신고 관리 기능

**프론트엔드:**
- http://localhost:5173 접속
- 관리자 로그인
- "신고 관리" 메뉴 확인
- 신고 목록 표시 확인
- "처리완료" 버튼 테스트

---

## 🔧 유용한 명령어

```bash
pnpm type-check   # 타입 체크
pnpm lint          # 린트 검사
pnpm test          # 테스트 실행
pnpm build         # 빌드
```

---

## 📚 문서

- [ROADMAP.md](docs/ROADMAP.md) - 프로젝트 로드맵
- [shrimp-rules.md](shrimp-rules.md) - 코딩 규칙
