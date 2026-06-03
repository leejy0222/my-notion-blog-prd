# 개인 개발 블로그 - 개발 로드맵 (ROADMAP)

**작성일**: 2026-06-04  
**버전**: 1.0  
**총 예상 기간**: 7주 (월·수·금, 주 3회 기준)

---

## 📋 개발 단계 개요

```
Phase 1: 초기 설정 → 공통 모듈 → 핵심 기능 → 추가 기능 → 최적화 & 배포
  ↓          ↓           ↓           ↓            ↓
 3-4일      2-3일       5-7일       2-3일        2-3일
```

---

## Phase 1️⃣ 프로젝트 초기 설정 (골격 구축)

**예상 기간**: 4 작업일 (2026-06-08 월 ~ 06-15 월)

### 📌 목표
프로젝트의 기본 골격을 완성하고, 모든 개발자가 동일한 환경에서 개발할 수 있도록 준비

### ✅ 수행할 작업

#### 1-1. Next.js 프로젝트 초기화 및 기본 설정
```
- Next.js 15 프로젝트 생성 (create-next-app)
- TypeScript 설정 (tsconfig.json)
- ESLint & Prettier 설정
- 환경 변수 설정 (.env.example, .env.local)
```
**소요 시간**: 1일  
**완료 기준**: `pnpm dev` 실행 시 Next.js 개발 서버 실행 가능

#### 1-2. Tailwind CSS & shadcn/ui 통합
```
- Tailwind CSS 설치 및 설정 (tailwind.config.js)
- PostCSS 설정
- shadcn/ui 초기화
- 기본 UI 컴포넌트 설치 (Button, Card, Input, Dialog 등)
- 글로벌 스타일 설정 (globals.css)
```
**소요 시간**: 1일  
**완료 기준**: shadcn/ui 컴포넌트를 import해서 페이지에 렌더링 가능

#### 1-3. Notion API 클라이언트 설정
```
- @notionhq/client 패키지 설치
- Notion API 키 발급 및 환경 변수 설정
- Notion 데이터베이스 생성
- 기본 API 호출 테스트
```
**소요 시간**: 1-2일  
**완료 기준**: Notion API 데이터를 성공적으로 조회할 수 있음

#### 1-4. 프로젝트 폴더 구조 생성
```
app/
├── layout.tsx              # 루트 레이아웃
├── page.tsx                # 홈 페이지
├── posts/
│   ├── page.tsx            # 글 목록 페이지
│   └── [slug]/
│       └── page.tsx        # 글 상세 페이지
└── category/
    └── [slug]/
        └── page.tsx        # 카테고리 필터 페이지

lib/
├── notion.ts               # Notion API 함수
├── types.ts                # TypeScript 타입 정의
└── utils.ts                # 유틸리티 함수

components/
├── Header.tsx
├── Footer.tsx
├── PostCard.tsx
├── PostContent.tsx
└── Navigation.tsx

styles/
├── globals.css
└── variables.css
```
**소요 시간**: 0.5일  
**완료 기준**: 모든 폴더가 생성되고 타입 정의 파일들이 준비됨

#### 1-5. Git 커밋 전략 및 GitHub 설정
```
- 커밋 메시지 컨벤션 정의 (feat, fix, docs, style, refactor, perf, test)
- 브랜치 전략 설정 (main, develop, feature/*)
- PR 템플릿 생성 (.github/pull_request_template.md)
- GitHub Actions (자동 배포) 기본 설정
```
**소요 시간**: 0.5일  
**완료 기준**: 커밋 컨벤션 문서화, PR 템플릿 생성 완료

### 🎯 왜 이 순서인가?
기본 골격이 없으면 뒤의 모든 개발이 불가능합니다. 개발 환경이 잘 갖춰져야 팀원들이 효율적으로 작업할 수 있습니다.

### 📊 완료 체크리스트
- [ ] Next.js + TypeScript 프로젝트 생성
- [ ] Tailwind CSS & shadcn/ui 통합
- [ ] Notion API 연동 (기본 테스트)
- [ ] 폴더 구조 생성
- [ ] GitHub PR 템플릿 작성
- [ ] 개발 환경 문서화

---

## Phase 2️⃣ 공통 모듈 & 컴포넌트 개발

**예상 기간**: 3 작업일 (2026-06-17 수 ~ 06-22 월)

### 📌 목표
모든 페이지에서 공통으로 사용할 모듈과 컴포넌트를 먼저 완성해서 나중 개발을 가속화

### ✅ 수행할 작업

#### 2-1. Notion API 유틸리티 함수 개발
```typescript
lib/notion.ts에 다음 함수 구현:

// 글 목록 조회 (필터링, 정렬 포함)
export async function getPosts(filters?: {
  category?: string;
  status?: string;
  limit?: number;
}): Promise<Post[]>

// 개별 글 조회
export async function getPostBySlug(slug: string): Promise<Post>

// 카테고리 목록 조회
export async function getCategories(): Promise<Category[]>

// 글 검색
export async function searchPosts(query: string): Promise<Post[]>

// 관련 글 조회
export async function getRelatedPosts(
  slug: string,
  limit?: number
): Promise<Post[]>
```
**소요 시간**: 1.5일  
**완료 기준**: 모든 함수가 구현되고 Notion에서 데이터를 정상적으로 조회

#### 2-2. TypeScript 타입 정의
```typescript
lib/types.ts에 다음 타입 정의:

// Notion에서 받는 Post 원본 데이터
type NotionPageObject = { ... }

// 애플리케이션에서 사용할 Post 타입
interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  publishedDate: Date;
  status: 'draft' | 'published' | 'archived';
  excerpt: string;
  content: NotionBlock[];
  viewCount?: number;
}

interface Category {
  id: string;
  name: string;
  postCount: number;
}

interface NotionBlock {
  type: string;
  content: any;
}
```
**소요 시간**: 1일  
**완료 기준**: 모든 타입이 정의되고 TypeScript 컴파일 에러 없음

#### 2-3. 공통 UI 컴포넌트 개발
```
components/Header.tsx
- 로고, 네비게이션 메뉴
- 테마 토글 버튼
- 검색 버튼
- 반응형 모바일 메뉴

components/Footer.tsx
- 저작권 정보
- 소셜 링크
- 빠른 링크

components/Navigation.tsx
- 카테고리 목록 네비게이션
- 활성 상태 표시

components/PostCard.tsx
- 글 제목, 날짜, 카테고리
- 글 요약 텍스트
- 읽기 시간 추정치
- 링크

components/PostContent.tsx
- Notion 블록 렌더링
- 코드 하이라이팅
- 이미지 최적화
```
**소요 시간**: 1.5일  
**완료 기준**: 모든 컴포넌트가 렌더링되고 Storybook에서 확인 가능

#### 2-4. 레이아웃 컴포넌트
```
components/Layout.tsx
- Header + Footer 포함
- 반응형 컨테이너 설정
- 메인 콘텐츠 영역

components/BlogLayout.tsx
- 사이드바 (카테고리, 최근 글)
- 메인 콘텐츠 영역
```
**소요 시간**: 1일  
**완료 기준**: 페이지에 Layout을 적용했을 때 일관된 디자인 유지

#### 2-5. 유틸리티 함수
```typescript
lib/utils.ts에 다음 함수 구현:

// 날짜 포맷팅
export function formatDate(date: Date): string

// 읽기 시간 계산
export function calculateReadingTime(content: string): number

// URL 슬러그 생성
export function generateSlug(title: string): string

// 메타 태그 생성
export function generateMetaTags(post: Post): MetaTags

// 문자열 자르기 (추상화)
export function truncateText(text: string, length: number): string
```
**소요 시간**: 0.5일  
**완료 기준**: 모든 유틸리티 함수가 테스트됨

### 🎯 왜 이 순서인가?
공통 모듈을 먼저 만들면, 이후 페이지 개발 시 반복적인 코드를 줄이고 일관성 있는 개발이 가능합니다. 또한 팀원들이 동일한 인터페이스를 사용하므로 협업이 용이합니다.

### 📊 완료 체크리스트
- [ ] Notion API 유틸리티 함수 구현
- [ ] TypeScript 타입 모두 정의
- [ ] Header, Footer, Navigation 컴포넌트 완성
- [ ] PostCard, PostContent 컴포넌트 완성
- [ ] Layout 컴포넌트 적용
- [ ] 유틸리티 함수 구현 및 테스트

---

## Phase 3️⃣ 핵심 기능 개발

**예상 기간**: 7 작업일 (2026-06-24 수 ~ 07-08 수)

### 📌 목표
블로그의 핵심 기능들을 구현해서 MVP(최소 기능 제품)를 완성

### ✅ 수행할 작업

#### 3-1. 홈 페이지 (/)
```
app/page.tsx 구현:

화면 구성:
1. Hero Section
   - 블로그 제목 및 설명
   - CTA 버튼

2. 최근 글 목록
   - PostCard 컴포넌트로 최신 글 6-10개 표시
   - "더 보기" 링크

3. 카테고리 미리보기
   - 주요 카테고리 표시

4. 뉴스레터 구독 섹션 (선택사항)

SEO 최적화:
- <Head> 메타 태그
- Open Graph 메타 태그
- 구조화된 데이터 (Schema.org)
```
**소요 시간**: 1.5일  
**완료 기준**: 홈 페이지가 렌더링되고, 최근 글이 Notion에서 정상 조회됨

#### 3-2. 글 목록 페이지 (/posts)
```
app/posts/page.tsx 구현:

기능:
1. 전체 글 목록 표시
2. 페이지네이션 또는 무한 스크롤
3. 정렬 옵션 (최신순, 인기순 등)
4. 필터링 UI (카테고리별)

레이아웃:
- 왼쪽: 필터 사이드바
- 오른쪽: 글 목록 (그리드 또는 리스트)

성능:
- ISR (Incremental Static Regeneration) 설정
- 이미지 최적화
```
**소요 시간**: 2일  
**완료 기준**: 글 목록이 페이지네이션 또는 무한 스크롤로 표시됨

#### 3-3. 글 상세 페이지 (/posts/[slug])
```
app/posts/[slug]/page.tsx 구현:

기능:
1. Notion 블록 렌더링
   - 텍스트, 제목, 이미지
   - 코드 블록 (Syntax Highlighting)
   - 인용문, 리스트
   - 링크, 강조

2. 메타데이터 표시
   - 작성일, 업데이트 일
   - 카테고리, 태그
   - 읽기 시간

3. 네비게이션
   - 이전/다음 글 링크
   - 목차 (Table of Contents)

4. SEO 최적화
   - 메타 태그
   - Open Graph
   - Schema.org 구조화된 데이터

5. 성능 최적화
   - ISR 설정
   - 이미지 최적화
   - 코드 스플리팅
```
**소요 시간**: 2.5일  
**완료 기준**: 글이 정상적으로 렌더링되고, Notion 블록들이 HTML로 변환 표시됨

#### 3-4. 카테고리 페이지 (/category/[slug])
```
app/category/[slug]/page.tsx 구현:

기능:
1. 카테고리별 글 목록 표시
2. 카테고리 설명 및 통계 (글 개수)
3. 글 정렬 (최신순, 인기순)
4. 동적 라우트 생성 (getStaticPaths)

레이아웃:
- 글 목록 페이지와 동일하되, 카테고리로 필터링됨

성능:
- ISR 설정
- 동적 라우트 프리페칭
```
**소요 시간**: 1.5일  
**완료 기준**: 각 카테고리별 글 목록이 정상 표시됨

#### 3-5. 검색 기능
```
기능 구현 방식:
1. 클라이언트 사이드 검색
   - 모든 글 데이터를 클라이언트에서 관리
   - 간단하지만 글이 많으면 성능 저하

또는

2. 서버 사이드 검색
   - API 라우트에서 검색 쿼리 처리
   - Notion API에서 데이터 필터링

구현:
app/api/search.ts 생성:
- 검색 쿼리 파라미터 수신
- Notion에서 데이터 필터링
- JSON 응답 반환

components/SearchBox.tsx:
- 검색 입력 필드
- 검색 결과 실시간 표시
- 자동완성 (선택사항)
```
**소요 시간**: 1.5일  
**완료 기준**: 검색어 입력 시 관련 글이 표시됨

### 🎯 왜 이 순서인가?
1. 홈 → 글 목록 → 글 상세 순서로 진행하면, 사용자의 방문 흐름을 따릅니다.
2. 카테고리와 검색은 글 데이터가 준비되어야 작업이 수월합니다.
3. 각 페이지마다 공통 컴포넌트를 재사용하므로 개발 속도가 빨라집니다.

### 📊 완료 체크리스트
- [ ] 홈 페이지 구현 및 스타일링
- [ ] 글 목록 페이지 구현 (페이지네이션)
- [ ] 글 상세 페이지 구현 (Notion 블록 렌더링)
- [ ] 카테고리 필터 페이지 구현
- [ ] 검색 기능 구현
- [ ] 모든 페이지 SEO 최적화
- [ ] 반응형 디자인 검증 (모바일, 태블릿, 데스크톱)

---

## Phase 4️⃣ 추가 기능 개발

**예상 기간**: 3 작업일 (2026-07-10 금 ~ 07-15 수)

### 📌 목표
MVP는 완성되었으므로, 사용자 경험을 향상시키는 추가 기능들을 개발

### ✅ 수행할 작업

#### 4-1. 관련 글 추천 (Related Posts)
```
위치: 글 상세 페이지 하단

구현:
1. 같은 카테고리의 글 중에서
2. 같은 태그를 가진 글 중에서
3. 조회순, 최신순으로 정렬

lib/notion.ts에 함수 추가:
export async function getRelatedPosts(
  slug: string,
  category: string,
  limit: number = 3
): Promise<Post[]>

components/RelatedPosts.tsx 생성
```
**소요 시간**: 1일  
**완료 기준**: 글 상세 페이지 하단에 관련 글 3-4개 표시

#### 4-2. 테이블 오브 컨텐츠 (Table of Contents)
```
위치: 글 상세 페이지 왼쪽 사이드바 또는 상단

구현:
1. 글의 모든 제목(H1, H2, H3)을 추출
2. 목차 생성
3. 클릭 시 해당 섹션으로 스크롤

components/TableOfContents.tsx 생성:
- 제목 단계별 들여쓰기
- 현재 보는 섹션 하이라이트
```
**소요 시간**: 1일  
**완료 기준**: 글의 목차가 표시되고, 클릭 시 해당 위치로 이동

#### 4-3. 태그 페이지 (/tags, /tags/[tag])
```
/tags:
- 모든 태그 목록 (클라우드 형태 또는 리스트)
- 각 태그별 글 개수

/tags/[tag]:
- 해당 태그를 가진 모든 글 목록
- 카테고리 필터링 가능

구현:
app/tags/page.tsx
app/tags/[tag]/page.tsx
```
**소요 시간**: 1day  
**완료 기준**: 태그별 글 목록 페이지가 정상 작동

#### 4-4. 조회수 추적 (View Counter) - 선택사항
```
방법 1: 외부 서비스 (Vercel Analytics, Plausible)
- 설정만으로 간단 구현
- 비용 발생 가능

방법 2: 커스텀 구현
- 간단한 API 라우트 생성
- 데이터베이스 필요 (선택: Supabase, MongoDB 등)

우선순위: 낮음 (선택사항)
```
**소요 시간**: 1-2일 (선택적)  
**완료 기준**: 글 조회 시 조회수가 증가

#### 4-5. 다크 모드 지원
```
구현:
1. next-themes 패키지 설치
2. 시스템 테마 감지
3. 사용자 테마 선택 저장 (localStorage)
4. Tailwind CSS dark: 클래스 사용

위치:
- Header의 테마 토글 버튼
- 전체 사이트에 적용

테스트:
- 라이트 모드 검증
- 다크 모드 검증
- 전환 애니메이션 부드러움
```
**소요 시간**: 1.5일  
**완료 기준**: 테마 토글이 작동하고, 모든 컴포넌트가 다크 모드 지원

### 🎯 왜 이 단계에서 하는가?
MVP가 완성되어야 사용자가 블로그를 사용할 수 있으므로, 추가 기능은 그 이후에 진행합니다. 이렇게 하면 우선순위가 명확하고, 필요시 일부 기능을 생략해도 서비스 제공이 가능합니다.

### 📊 완료 체크리스트
- [ ] 관련 글 추천 구현
- [ ] 목차 (TOC) 구현
- [ ] 태그 페이지 구현
- [ ] 다크 모드 구현 (선택사항)
- [ ] 조회수 추적 구현 (선택사항)

---

## Phase 5️⃣ 최적화 및 배포

**예상 기간**: 3 작업일 (2026-07-17 금 ~ 07-22 수)

### 📌 목표
성능을 최적화하고, 프로덕션 환경에 안정적으로 배포

### ✅ 수행할 작업

#### 5-1. 성능 최적화
```
1. 번들 크기 분석
   - next/bundle-analyzer 사용
   - 불필요한 라이브러리 제거
   - 동적 임포트 활용

2. 이미지 최적화
   - Next.js <Image> 컴포넌트 사용
   - Notion 이미지 최적화
   - WebP 형식 지원

3. 캐싱 전략
   - ISR (Incremental Static Regeneration) 설정
   - 자동 캐시 갱신 주기 설정 (revalidate)
   - API 응답 캐싱

4. 코드 분할
   - 동적 컴포넌트 로딩
   - 라우트별 코드 스플리팅

5. Font 최적화
   - system-ui 또는 최소한의 외부 폰트
   - font-display: swap 사용
```
**소요 시간**: 1.5일  
**완료 기준**:
- Lighthouse 성능 점수 90 이상
- FCP < 1.5초
- LCP < 2.5초
- CLS < 0.1

#### 5-2. SEO 최적화
```
1. 메타 태그 확인
   - 모든 페이지에 description, keywords
   - Open Graph 메타 태그
   - Twitter Card 메타 태그

2. 사이트맵 생성
   - app/sitemap.ts 생성
   - 모든 페이지 URL 포함

3. robots.txt 작성
   - public/robots.txt 생성

4. 구조화된 데이터
   - Schema.org (BlogPosting, BlogPostCollection)
   - JSON-LD 형식

5. Mobile-Friendly 검증
   - Google Mobile-Friendly Test
   - 반응형 디자인 검증

6. Core Web Vitals 최적화
   - Lighthouse로 측정
   - 각 지표 개선
```
**소요 시간**: 1일  
**완료 기준**:
- Google Search Console 등록 가능
- 모든 페이지 구조화된 데이터 포함
- Mobile-Friendly 확인됨

#### 5-3. 보안 점검
```
1. 환경 변수 검증
   - .env.local이 .gitignore에 있는지 확인
   - 민감한 정보 노출 확인

2. CORS 설정
   - Notion API 요청 도메인 확인

3. 헤더 보안
   - Content Security Policy (CSP)
   - X-Frame-Options
   - X-Content-Type-Options

4. 입력 검증
   - 검색 쿼리 검증
   - URL 파라미터 검증

5. 의존성 검사
   - npm audit
   - 취약점 있는 패키지 업데이트
```
**소요 시간**: 1일  
**완료 기준**: 보안 취약점 없음 (npm audit 통과)

#### 5-4. 테스트 및 QA
```
1. 수동 테스트
   - 모든 페이지 브라우저에서 확인
   - 다양한 디바이스 테스트 (모바일, 태블릿, 데스크톱)
   - 네트워크 느림 상황 테스트 (Throttling)

2. 자동화 테스트 (선택사항)
   - Jest로 유틸리티 함수 테스트
   - React Testing Library로 컴포넌트 테스트
   - Cypress로 E2E 테스트

3. 브라우저 호환성
   - Chrome, Firefox, Safari, Edge 최신 버전 테스트
   - 이전 버전 호환성 확인

4. Notion API 연동 테스트
   - 다양한 콘텐츠 타입 테스트
   - API Rate Limit 테스트
   - 오류 처리 검증
```
**소요 시간**: 1.5일  
**완료 기준**: 주요 기능 모두 정상 작동 확인

#### 5-5. Vercel 배포
```
1. Vercel 프로젝트 생성
   - GitHub 저장소 연결
   - 환경 변수 설정

2. 배포 설정
   - Build command: pnpm build
   - Start command: pnpm start
   - Node.js 버전 설정

3. 커스텀 도메인 설정 (선택사항)
   - DNS 레코드 설정
   - SSL 인증서 자동 설정

4. 배포 자동화
   - main 브랜치 푸시 시 자동 배포
   - 미리보기 배포 (Preview Deployments) 활성화

5. 모니터링 설정
   - Vercel Analytics 설정
   - 에러 로깅 (선택: Sentry)
```
**소요 시간**: 1일  
**완료 기준**: 프로덕션 URL에서 사이트 접근 가능

#### 5-6. 성능 모니터링
```
1. Web Vitals 모니터링
   - Vercel Analytics
   - Google PageSpeed Insights

2. 에러 모니터링
   - Sentry 설정 (선택사항)
   - 콘솔 에러 추적

3. 분석 설정
   - Google Analytics 또는 Plausible
   - 방문자 통계, 인기 글 추적

4. 정기적인 성능 점검
   - 주 1회 Lighthouse 측정
   - 월 1회 SEO 점검
```
**소요 시간**: 0.5일  
**완료 기준**: 모니터링 대시보드 설정 완료

#### 5-7. 배포 후 체크리스트
```
프로덕션 배포 후 확인사항:
- [ ] 사이트 접근 가능
- [ ] 모든 링크 정상 작동
- [ ] 글 목록 표시
- [ ] 글 상세 페이지 정상
- [ ] 검색 기능 작동
- [ ] 이미지 로딩
- [ ] 반응형 디자인 작동
- [ ] 메타 태그 확인 (브라우저 개발자 도구)
- [ ] Google Search Console 등록
- [ ] Vercel 배포 성공
```

### 🎯 왜 이 순서인가?
1. 기능 개발이 완료되어야 최적화 대상을 파악할 수 있습니다.
2. 성능과 SEO는 배포 전에 최적화해야 초기 사용자 경험이 좋습니다.
3. 보안은 배포 직전에 최종 점검해야 취약점을 막을 수 있습니다.

### 📊 완료 체크리스트
- [ ] Lighthouse 성능 점수 90+ 달성
- [ ] 메타 태그, 사이트맵, robots.txt 설정
- [ ] 보안 취약점 없음 (npm audit)
- [ ] 모든 브라우저에서 테스트 완료
- [ ] Vercel 배포 성공
- [ ] 프로덕션 환경 최종 점검

---

## 📊 전체 타임라인 (월·수·금, 주 3회 작업)

```
Week 1 (2026-06-04 ~ 06-15)
├─ 기획: 06-04(목) ← 프로젝트 기획일
├─ Phase 1-1: 06-08(월●), 06-10(수●), 06-12(금●)
└─ Phase 1-2: 06-15(월●)
   └─ Phase 1: 프로젝트 초기 설정 (4 작업일)

Week 2 (2026-06-17 ~ 06-22)
├─ Phase 2-1: 06-17(수●), 06-19(금●)
└─ Phase 2-2: 06-22(월●)
   └─ Phase 2: 공통 모듈/컴포넌트 (3 작업일)

Week 3 (2026-06-24 ~ 07-08)
├─ Phase 3-1: 06-24(수●), 06-26(금●)
├─ Phase 3-2: 06-29(월●), 07-01(수●), 07-03(금●)
├─ Phase 3-3: 07-06(월●), 07-08(수●)
└─ Phase 3: 핵심 기능 개발 (7 작업일)

Week 4 (2026-07-10 ~ 07-15)
├─ Phase 4-1: 07-10(금●), 07-13(월●)
└─ Phase 4-2: 07-15(수●)
   └─ Phase 4: 추가 기능 개발 (3 작업일)

Week 5 (2026-07-17 ~ 07-22)
├─ Phase 5-1: 07-17(금●), 07-20(월●)
└─ Phase 5-2: 07-22(수●) ← v1.0 릴리스
   └─ Phase 5: 최적화 및 배포 (3 작업일)

예상 총 소요 기간: 7주 (20 작업일, 월·수·금)
```

---

## 🎯 마일스톤 (월·수·금, 주 3회 기준)

| 날짜 | 마일스톤 | 상태 |
|------|---------|------|
| 2026-06-15 (월) | Phase 1 완료 (초기 설정) | ⏳ 예정 |
| 2026-06-22 (월) | Phase 2 완료 (공통 모듈) | ⏳ 예정 |
| 2026-07-08 (수) | Phase 3 완료 (핵심 기능, MVP) | ⏳ 예정 |
| 2026-07-15 (수) | Phase 4 완료 (추가 기능) | ⏳ 예정 |
| 2026-07-22 (수) | Phase 5 완료 (배포, v1.0 릴리스) | ⏳ 예정 |

---

## ⚠️ 주의사항

### 1. 시간 추정의 유연성
- 위의 예상 기간은 참고용이며, 실제 진행 상황에 따라 조정될 수 있습니다.
- 예상치 못한 문제가 발생할 수 있으므로 여유 시간을 고려하세요.

### 2. 우선순위 조정
- 일정이 지연되는 경우 Phase 4의 선택사항들(다크 모드, 조회수 등)을 미루고 배포를 우선시합니다.
- Phase 3 (핵심 기능)은 반드시 완료해야 블로그로 서비스 가능합니다.

### 3. 블로킹 이슈
- Notion API 연동 실패 → Phase 2에서 해결 필요
- Next.js 설정 문제 → Phase 1에서 해결 필요

### 4. 지속적인 개선
- 배포 후에도 사용자 피드백을 반영한 개선을 계속합니다.
- Phase 6부터는 기능 추가 및 버그 수정 사항들을 계획합니다.

---

## 🔄 Phase 6 이후 (지속적인 개선)

### 계획된 기능들
- 📰 RSS 피드 생성
- 💬 댓글 시스템 (Utterances, Giscus)
- 📊 조회수 및 인기글 추적
- 📧 뉴스레터 구독
- 🌍 다국어 지원
- 🎨 추가 테마 지원
- ⚡ 성능 개선 (캐싱 최적화 등)

### 버전 관리
- **v1.0**: MVP 완성 (2026-07-22)
- **v1.1**: 추가 기능 (다크 모드, TOC 등)
- **v2.0**: 고급 기능 (댓글, 뉴스레터 등)

---

**최종 업데이트**: 2026-06-04  
**담당자**: Development Team  
**진행 상황**: 준비 단계
