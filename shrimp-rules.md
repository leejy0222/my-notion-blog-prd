# Development Guidelines - Notion CMS Blog Project

## Project Overview

### 프로젝트 정의
- **Project Name**: 개인 개발 블로그 (Personal Tech Blog with Notion CMS)
- **Purpose**: Notion을 CMS로 활용한 현대적 개인 기술 블로그 구축
- **Current State**: 기존 RPA 프로젝트 기반에서 Notion CMS 블로그로 전환 진행 중
- **Target Users**: 개인 개발자 (블로그 운영자 및 방문자)

### 핵심 기능
- Notion API를 통한 글 조회 및 동기화
- 글 목록, 상세, 카테고리 필터링 페이지
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- SEO 최적화 및 빠른 로딩

---

## Project Architecture

### 1. 모노레포 구조 (pnpm Workspace)

```
notion-cms-project/
├── apps/
│   ├── frontend/          # React + Vite (현재 활발한 개발 영역)
│   └── backend/           # Express.js (현재 제한적 사용, RPA 관련)
├── packages/
│   └── shared/            # 공유 타입 및 유틸리티
└── pnpm-workspace.yaml    # 워크스페이스 설정
```

**규칙**:
- 현재 개발 중심은 `apps/frontend` (Notion CMS 블로그)
- 각 앱은 독립적인 `package.json`과 `tsconfig.json` 보유
- `packages/shared`는 공유 타입 및 상수만 포함

### 2. Frontend 구조 (현재 개발 중심)

**앞으로 변환될 구조 (Next.js 기반)**:
```
apps/frontend/
├── app/                   # Next.js App Directory
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   ├── posts/
│   │   ├── page.tsx       # 글 목록
│   │   └── [slug]/
│   │       └── page.tsx   # 글 상세 페이지
│   └── category/
│       └── [slug]/
│           └── page.tsx   # 카테고리 필터링 페이지
├── components/
│   ├── PostCard.tsx       # 글 카드 컴포넌트
│   ├── PostContent.tsx    # Notion 블록 렌더링
│   ├── Navigation.tsx     # 네비게이션
│   └── ui/                # shadcn/ui 컴포넌트들
├── lib/
│   ├── notion.ts          # Notion API 함수들
│   ├── types.ts           # TypeScript 타입 정의
│   └── utils.ts           # 유틸리티 함수
├── hooks/                 # React Custom Hooks
├── store/                 # Zustand 상태 관리
├── styles/                # Tailwind CSS
└── config/                # 설정 파일
```

**현재 상태 (Vite 기반)**:
- `src/components/`, `src/pages/`, `src/store/` 구조 사용
- 이 구조는 Next.js로 마이그레이션될 예정
- 마이그레이션 전까지 기존 구조 유지

---

## Code Standards

### 1. TypeScript & Naming Conventions

#### 파일명
- **폴더**: snake_case (예: `components/ui/`, `lib/`)
- **컴포넌트 파일**: PascalCase (예: `PostCard.tsx`, `Navigation.tsx`)
- **유틸리티/라이브러리**: camelCase (예: `notion.ts`, `useApi.ts`, `authStore.ts`)
- **테스트 파일**: `*.test.ts` 또는 `*.test.tsx`

#### 변수 및 함수
- **변수/함수**: camelCase (예: `getUserPosts`, `isPublished`)
- **클래스**: PascalCase (예: `NotionClient`, `PostService`)
- **상수**: UPPER_SNAKE_CASE (예: `MAX_POSTS_PER_PAGE`, `API_BASE_URL`)
- **인터페이스/타입**: PascalCase (예: `Post`, `NotionResponse`, `BlogConfig`)

### 2. 코드 스타일

- **들여쓰기**: 2칸 (스페이스)
- **세미콜론**: 필수 사용
- **따옴표**: 더블 따옴표 `"` (일관성)
- **라인 길이**: 최대 100자 권장 (넘으면 줄바꿈)

**예제**:
```typescript
// ✅ 올바른
export const getPosts = async (limit: number): Promise<Post[]> => {
  const response = await fetch(`/api/posts?limit=${limit}`);
  return response.json();
};

// ❌ 잘못된
const getPosts = async (limit) => {
  const res = await fetch('/api/posts?limit=' + limit)
  return res.json()
}
```

### 3. TypeScript 타입 정의

- **any 타입 금지**: 항상 명시적 타입 정의
- **반환 타입 명시**: 함수는 항상 반환 타입 명시
- **제네릭 활용**: 재사용 가능한 코드는 제네릭 사용

**예제**:
```typescript
// ✅ 올바른
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  publishedAt: Date;
  category: string;
  tags: string[];
}

export const fetchPost = async (slug: string): Promise<Post | null> => {
  // 구현
};

// ❌ 잘못된
const fetchPost = async (slug) => {
  // any 타입 없이 구현
};
```

### 4. 주석 규칙

- **WHY 주석만**: 코드가 WHY를 설명하지 않을 때만 주석 작성
- **비즈니스 로직 주석**: 한국어 사용 가능
- **코드 설명 금지**: WHAT은 코드가 이미 설명함

**예제**:
```typescript
// ✅ 올바른 - WHY를 설명
// Notion에서는 최대 100개까지만 동시에 쿼리 가능하므로 배치 처리
const BATCH_SIZE = 100;

// ❌ 잘못된 - WHAT을 설명
const batchSize = 100; // 배치 크기를 100으로 설정

// ✅ 올바른 - 복잡한 비즈니스 로직 설명
// 발행된 글 중 최신순으로 정렬하되, 스폰서 글은 항상 상단에
const sortPosts = (posts: Post[]): Post[] => {
  return posts
    .filter((p) => p.status === "published")
    .sort((a, b) => {
      if (a.isSponsored) return -1;
      if (b.isSponsored) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
};
```

---

## Technology Stack

### Frontend (활발한 개발 영역)

| 기술 | 용도 | 버전 | 규칙 |
|------|------|------|------|
| **Next.js** | React 프레임워크 | 15.x | App Router 사용, SSG/ISR 활용 |
| **TypeScript** | 타입 안전성 | 5.x | 모든 파일에 완전한 타입 정의 |
| **React** | UI 라이브러리 | 18.x | Functional Components만 사용 |
| **Tailwind CSS** | 스타일링 | 3.x | 유틸리티 우선 (커스텀 CSS 최소화) |
| **shadcn/ui** | UI 컴포넌트 | Latest | 재사용 가능한 컴포넌트 기반 |
| **Lucide React** | 아이콘 | Latest | SVG 아이콘 사용 |
| **Zustand** | 상태 관리 | 4.x | 전역 상태만 관리 |
| **React Hook Form** | 폼 처리 | 7.x | Zod와 함께 검증 |
| **Zod** | 폼 검증 | 3.x | DTO 레벨 검증 |
| **@notionhq/client** | Notion API | Latest | Notion 데이터 조회용 |

### Backend (제한적 사용)

- Express.js + TypeScript
- 현재 아키텍처: Controller → Service → Repository
- 현재 상태: RPA 관련 코드 남아있음

### Shared Package

- TypeScript 타입만 포함
- 공유 상수 및 유틸리티

---

## Framework / Library Usage Standards

### 1. Next.js 규칙

- **App Router 사용**: Pages Router 금지
- **Server Components 활용**: 기본값으로 Server Component 사용
- **동적 라우트**: `[slug]`, `[...slug]` 사용으로 동적 페이지 생성
- **ISR 활용**: 자주 변경되지 않는 콘텐츠는 ISR 사용 (재검증 시간 설정)

**예제**:
```typescript
// ✅ 올바른 - Server Component로 데이터 조회
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <PostContent post={post} />;
}

// Next.js 캐싱 설정
export const revalidate = 3600; // 1시간마다 재검증
```

### 2. React Hook Form + Zod

- Zod로 검증 스키마 정의
- `useForm`으로 폼 상태 관리
- `resolver`로 Zod 스키마 적용

**예제**:
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().min(1, "검색어를 입력하세요"),
});

export function SearchForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(searchSchema),
  });

  return (
    <form onSubmit={handleSubmit((data) => search(data.query))}>
      <input {...register("query")} />
      {errors.query && <span>{errors.query.message}</span>}
    </form>
  );
}
```

### 3. Zustand 상태 관리

- 전역 상태만 관리 (예: 인증, 테마, 필터)
- 로컬 상태는 `useState` 사용
- 상태 파일명: `[name]Store.ts`

**예제**:
```typescript
import { create } from "zustand";

interface BlogStore {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useBlogStore = create<BlogStore>((set) => ({
  selectedCategory: "all",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
```

### 4. Tailwind CSS 규칙

- 커스텀 CSS 최소화 (99% Tailwind 유틸리티 사용)
- 반응형: `sm:`, `md:`, `lg:`, `xl:` 프리픽스
- 다크 모드: `dark:` 클래스 사용

**예제**:
```tsx
// ✅ 올바른
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">

// ❌ 잘못된
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
```

### 5. shadcn/ui 컴포넌트 사용

- 제공되는 UI 컴포넌트 재사용 (Button, Card, Dialog 등)
- 커스터마이징: `cn()` 함수로 클래스 병합
- 새 컴포넌트 추가 전 기존 컴포넌트 활용 검토

**예제**:
```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PostCard({ post, className }: { post: Post; className?: string }) {
  return (
    <Card className={cn("p-4", className)}>
      <h2>{post.title}</h2>
      <Button onClick={() => viewPost(post.slug)}>자세히 보기</Button>
    </Card>
  );
}
```

---

## Notion API Integration

### 1. Notion 데이터 조회

- **단일 쿼리 최대 크기**: 100개 (배치 처리 필수)
- **Rate Limiting**: 초당 3회 요청 제한 (재시도 로직 구현)
- **캐싱**: 자주 변경되지 않는 데이터는 ISR 또는 메모리 캐싱

**예제**:
```typescript
// lib/notion.ts
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getPublishedPosts(limit: number = 10): Promise<Post[]> {
  const response = await notion.databases.query({
    database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      select: {
        equals: "발행됨",
      },
    },
    sorts: [
      {
        property: "PublishedDate",
        direction: "descending",
      },
    ],
    page_size: limit,
  });

  return response.results.map((page) => mapNotionPageToPost(page));
}
```

### 2. Notion 블록 렌더링

- Notion 블록 타입별 렌더링 로직 구현
- XSS 방지를 위해 `DOMPurify` 또는 `next-safe-html` 사용
- 이미지 최적화: `next/image` 사용

**규칙**:
- 코드 블록: `<pre><code>` 사용, 언어 하이라이트 (Prism.js 등)
- 텍스트: Markdown 마크업 지원
- 이미지: Next.js Image 컴포넌트로 최적화
- 링크: 내부 링크는 `<Link>`, 외부는 `<a target="_blank">`

---

## Database & API Response Standards

### 1. API 응답 형식 일관성

모든 API 응답은 다음 형식 준수:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}
```

### 2. 데이터 타입 정의

- `types.ts`에 모든 핵심 타입 정의
- Notion 데이터를 타입 정의 모델로 매핑

**예제** (`types.ts`):
```typescript
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  publishedDate: Date;
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  author: string;
  readingTime: number;
  imageUrl?: string;
}

export interface Category {
  name: string;
  slug: string;
  postCount: number;
}
```

---

## Key File Interaction Standards

### 1. 모노레포 내 의존성 관리

**규칙**:
- `apps/frontend`와 `apps/backend` 간 직접 의존성 금지
- 공유 타입은 `packages/shared`를 통해서만 import
- `package.json` 의존성: `"@rpa/shared": "workspace:*"`

**올바른 import 예제**:
```typescript
// ✅ 올바른
import { Post, Category } from "@rpa/shared";

// ❌ 잘못된
import { User } from "../../backend/src/types";
```

### 2. 컴포넌트 간 prop drilling 방지

**규칙**:
- 3단계 이상 prop drilling 필요 시 Zustand로 상태 전환
- Context API는 테마, 언어 등 앱 전역 설정만 사용

**예제**:
```typescript
// ❌ 잘못된 - prop drilling
function Page({ selectedCategory }) {
  return <List selectedCategory={selectedCategory} />;
}

function List({ selectedCategory }) {
  return <Card selectedCategory={selectedCategory} />;
}

// ✅ 올바른 - Zustand 사용
const useBlogStore = create((set) => ({
  selectedCategory: "all",
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
}));

function Card() {
  const { selectedCategory } = useBlogStore();
  return <div>{selectedCategory}</div>;
}
```

### 3. 파일 수정 시 동시 수정 필요 사항

| 파일 | 동시 수정 필요 파일 | 이유 |
|------|-------|------|
| `packages/shared/src/types/api.ts` | `apps/frontend/src/lib/types.ts` | 타입 동기화 |
| `README.md` | `docs/PRD.md` | 문서 일관성 |
| `.env.example` | 배포 설정 문서 | 환경변수 문서화 |
| Notion 데이터베이스 구조 변경 | `lib/notion.ts`, `types.ts` | API 매핑 업데이트 |

---

## Prohibited Actions & Anti-patterns

### 1. 절대 금지 사항

- ❌ **any 타입 사용**: 항상 명시적 타입 정의
- ❌ **Pages Router**: Next.js App Router 사용
- ❌ **클래스 컴포넌트**: Functional Components만 사용
- ❌ **직접 DOM 조작**: `useRef`로 제한적 사용
- ❌ **전역 변수**: Zustand 또는 Context 사용
- ❌ **공개 API 키 노출**: 환경 변수 사용 (`.env.local`, `.env.example`)
- ❌ **XSS 위험**: Notion 블록 렌더링 시 반드시 sanitize

### 2. 아키텍처 안티패턴

- ❌ **로직 혼재**: UI ↔ 비즈니스 로직 분리
- ❌ **과도한 abstraction**: 불필요한 유틸리티 함수
- ❌ **순환 의존성**: A → B → A 구조 금지
- ❌ **모듈 경계 위반**: `apps/backend` 직접 import 금지

**올바른 구조**:
```
Component → Hook → Service → Notion API
               ↓
           Zustand Store
```

### 3. 스타일링 안티패턴

- ❌ **인라인 스타일**: `style={{ ... }}` 금지 (Tailwind 사용)
- ❌ **CSS-in-JS**: styled-components 금지 (Tailwind + shadcn/ui)
- ❌ **하드코딩된 크기**: 반응형 클래스 사용 (`md:`, `lg:`)

---

## Error Handling & Security

### 1. 에러 처리

**규칙**:
- 모든 async 함수에 try-catch 구현
- Notion API 오류: 재시도 로직 (최대 3회)
- 사용자 입력: Zod 스키마로 검증
- 에러 메시지: 사용자 친화적 한국어

**예제**:
```typescript
export async function getPosts(): Promise<Post[]> {
  try {
    const posts = await notion.databases.query({
      database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID!,
    });
    return posts.results.map(mapNotionPageToPost);
  } catch (error) {
    console.error("Notion API 오류:", error);
    // 재시도 또는 fallback
    return [];
  }
}
```

### 2. 보안 고려사항

- **Notion API 키**: 환경 변수 (.env.local)에만 저장
- **CSP 헤더**: Next.js 설정에서 구성
- **CORS**: Notion API는 브라우저에서 직접 호출 금지 (API 라우트 경유)
- **입력 검증**: 검색어, 필터 등 모든 입력 검증
- **출력 인코딩**: Notion 블록 렌더링 시 XSS 방지

---

## Testing Standards

### 1. 테스트 작성 규칙

- **테스트 프레임워크**: Vitest (기존 설정)
- **커버리지 목표**: 60% 이상
- **핵심 로직**: 100% 테스트 필수

### 2. 테스트 파일 구조

```typescript
// lib/notion.test.ts
describe("notion API", () => {
  describe("getPublishedPosts", () => {
    it("발행된 글만 조회해야 함", async () => {
      // 테스트 구현
    });

    it("Notion API 오류 시 빈 배열 반환", async () => {
      // 테스트 구현
    });
  });
});
```

---

## Deployment & Environment

### 1. 환경 변수 관리

**`.env.example` 템플릿**:
```env
# Notion Configuration
NEXT_PUBLIC_NOTION_DATABASE_ID=your_database_id
NOTION_API_KEY=your_api_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=개인 기술 블로그
```

**규칙**:
- 공개 변수: `NEXT_PUBLIC_` 프리픽스
- 비공개 변수: 서버 측만 접근
- `.env.local` 파일은 `.gitignore`에 등록

### 2. 배포 환경

- **호스팅**: Vercel
- **CI/CD**: GitHub Actions
- **성능 목표**:
  - Lighthouse Performance: 90+
  - First Contentful Paint (FCP): < 1.5초
  - Largest Contentful Paint (LCP): < 2.5초

---

## Decision Making Framework (AI를 위한)

### 상황별 의사결정 규칙

| 상황 | 결정 | 이유 |
|------|------|------|
| 새 페이지 생성 | Next.js App Router 동적 라우트 | 확장성, SEO |
| 상태 관리 필요 | 로컬 상태는 useState, 전역은 Zustand | 성능, 단순성 |
| 공통 컴포넌트 필요 | shadcn/ui 기반 사용 후 커스터마이징 | 일관성, 유지보수 |
| 성능 최적화 | Next.js ISR, Image 최적화, Code Splitting | 사용자 경험 |
| 데이터 검증 | Zod 스키마 정의 후 resolver 사용 | 타입 안전, 일관성 |
| 에러 처리 | 사용자 친화적 메시지 + 로깅 | 디버깅, UX |
| 스타일링 | Tailwind 유틸리티 우선 | 일관성, 성능 |

---

## Current Project Migration Status

### Phase 1: 초기 설정 (진행 중)
- ✅ 프로젝트 생성 및 문서화
- ⏳ Notion API 연동 초기화
- ⏳ Next.js 마이그레이션 (현재 Vite)
- ⏳ shadcn/ui 통합

### Phase 2: 핵심 기능 구현 (예정)
- 글 목록/상세 페이지
- 카테고리 필터링
- 검색 기능

### Phase 3: 배포 (예정)
- Vercel 배포
- SEO 최적화
- 성능 튜닝

---

## References & Documentation

- 프로젝트 PRD: `docs/PRD.md`
- 개발 로드맵: `README.md` (ROADMAP 섹션)
- Notion API 문서: https://developers.notion.com/
- Next.js 가이드: https://nextjs.org/docs
- shadcn/ui: https://ui.shadcn.com/
