# 📝 개인 개발 블로그 - Notion CMS 기반

Notion을 CMS로 활용한 모던한 개인 기술 블로그입니다. Notion에서 글을 작성하면 자동으로 블로그에 반영됩니다.

![Next.js](https://img.shields.io/badge/Next.js-15.0-000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-06b6d4?logo=tailwindcss)
![Notion API](https://img.shields.io/badge/Notion%20API-v1-000?logo=notion)

---

## 🎯 프로젝트 개요

**Notion을 CMS로 사용하는 이유:**
- ✅ 직관적인 UI로 쉬운 콘텐츠 관리
- ✅ 별도 백엔드 서버 불필요 (Notion API만 사용)
- ✅ 자동 동기화 (Notion 업데이트 → 블로그 자동 반영)
- ✅ 메타데이터 관리 (카테고리, 태그, 발행일 등)
- ✅ 무료로 시작 가능

---

## ✨ 주요 기능

### MVP (최소 기능)
- 📖 **글 목록**: Notion에서 발행된 글 자동 조회
- 📄 **글 상세**: 개별 글의 전체 내용 표시 (Notion 블록 렌더링)
- 🏷️ **카테고리 필터**: 카테고리별 글 조회
- 🔍 **검색**: 제목 및 내용 기반 검색
- 📱 **반응형**: 모바일/태블릿/데스크톱 최적화

### Phase 2 계획
- 💬 댓글 시스템
- 🔗 관련 글 추천
- 📊 조회수 추적
- 🌙 다크 모드
- 📰 RSS 피드

---

## 🛠️ 기술 스택

### Frontend
| 기술 | 용도 |
|------|------|
| **Next.js 15** | React 프레임워크 |
| **TypeScript** | 타입 안전성 |
| **Tailwind CSS** | 스타일링 |
| **shadcn/ui** | UI 컴포넌트 |
| **Lucide React** | 아이콘 |

### CMS & Backend
| 기술 | 용도 |
|------|------|
| **Notion API** | 콘텐츠 관리 |
| **@notionhq/client** | Notion API 클라이언트 |
| **ISR** | 캐싱 & 성능 최적화 |

### Deployment
| 기술 | 용도 |
|------|------|
| **Vercel** | 호스팅 |
| **GitHub** | 소스 관리 |

---

## 📅 개발 로드맵

### Phase별 핵심 순서

**Phase 1**: 프로젝트 초기 설정 및 Notion API 연동  
**Phase 2**: Notion API 함수 및 공통 UI 컴포넌트  
**Phase 3**: 블로그 홈·목록·상세 페이지 구현  
**Phase 4**: 카테고리·태그·관련글 추가 기능  
**Phase 5**: SEO 최적화 및 Vercel 배포

**자세한 일정**: [`docs/ROADMAP.md`](docs/ROADMAP.md) 참고

---

## 📁 프로젝트 구조

```
notion-cms-project/
├── app/                      # Next.js 앱 디렉토리
│   ├── layout.tsx            # 루트 레이아웃
│   ├── page.tsx              # 홈 페이지
│   ├── posts/
│   │   ├── page.tsx          # 글 목록
│   │   └── [slug]/
│   │       └── page.tsx      # 글 상세
│   └── category/
│       └── [slug]/
│           └── page.tsx      # 카테고리 글 목록
├── lib/
│   ├── notion.ts             # Notion API 함수
│   ├── types.ts              # TypeScript 타입
│   └── utils.ts              # 유틸리티
├── components/               # React 컴포넌트
│   ├── PostCard.tsx
│   ├── PostContent.tsx
│   └── Navigation.tsx
├── docs/                     # 문서
│   └── PRD.md               # Product Requirements Document
├── .env.example              # 환경 변수 템플릿
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 18+ 
- pnpm (또는 npm/yarn)
- Notion 계정
- Notion API 키

### 1단계: 저장소 클론
```bash
git clone https://github.com/yourusername/notion-cms-project.git
cd notion-cms-project
```

### 2단계: 의존성 설치
```bash
pnpm install
```

### 3단계: 환경 변수 설정
```bash
cp .env.example .env.local
```

`.env.local` 파일에 다음 내용 추가:
```env
NEXT_PUBLIC_NOTION_DATABASE_ID=your_notion_database_id
NOTION_API_KEY=your_notion_api_key
```

### 4단계: 개발 서버 실행
```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

---

## 🔧 Notion 데이터베이스 설정

### 데이터베이스 구조
Notion에서 다음 필드를 가진 데이터베이스 생성:

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| **Title** | Title | ✓ | 글 제목 |
| **Slug** | Text | ✓ | URL 슬러그 (e.g., "my-first-post") |
| **Category** | Select | ✓ | 카테고리 |
| **Tags** | Multi-select | | 태그들 |
| **Published** | Date | ✓ | 발행 날짜 |
| **Status** | Select | ✓ | 상태 (초안/발행됨) |
| **Content** | Page | ✓ | 글 본문 |
| **Excerpt** | Text | | 글 요약 |

### 카테고리 예시
- React
- Next.js
- TypeScript
- Tailwind CSS
- 성능 최적화
- DevOps

---

## 📋 API 통합

### Notion API 사용법

```typescript
// lib/notion.ts
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 글 목록 조회
export async function getPosts() {
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
        property: "Published",
        direction: "descending",
      },
    ],
  });

  return response.results;
}
```

---

## ⚡ 성능 최적화

- **ISR (Incremental Static Regeneration)**: 블로그 글은 빌드 시 정적 생성
- **Image Optimization**: Next.js Image 컴포넌트 사용
- **Code Splitting**: 동적 import로 번들 크기 최소화
- **Caching**: Notion API 응답 캐싱

**성능 목표:**
- Lighthouse Performance: 90+
- First Contentful Paint (FCP): < 1.5초
- Largest Contentful Paint (LCP): < 2.5초

---

## 📚 주요 파일 설명

### `lib/notion.ts`
Notion API와의 상호작용을 담당하는 핵심 파일
- 데이터 조회 함수
- 타입 변환
- 에러 처리

### `components/PostCard.tsx`
블로그 글 목록의 개별 카드 컴포넌트

### `components/PostContent.tsx`
Notion 블록을 HTML로 렌더링하는 컴포넌트

### `app/posts/[slug]/page.tsx`
동적 글 상세 페이지

---

## 🔐 보안

- Notion API 키는 `.env.local`에만 저장 (버전 관리 제외)
- 공개 데이터만 블로그에 표시 (Status = "발행됨")
- XSS 방지 (Notion 블록 렌더링 시 sanitize)
- CORS 설정 (필요시)

---

## 📊 프로젝트 로드맵

### Phase 1: MVP (2026-06-01 ~ 06-15)
- ✅ 프로젝트 초기화
- ✅ Notion API 연동
- ⏳ 글 목록/상세 페이지
- ⏳ 스타일링 & 반응형
- ⏳ 배포

### Phase 2: 고급 기능 (2026-06-16 이후)
- 댓글 시스템
- 관련 글 추천
- 다크 모드
- RSS 피드

자세한 내용은 [`docs/PRD.md`](docs/PRD.md) 참고

---

## 🤝 기여 가이드

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 개발 가이드

### 코딩 스타일
- **들여쓰기**: 2칸
- **네이밍**: camelCase
- **타입**: TypeScript로 모든 타입 명시 (any 금지)
- **주석**: 필요한 경우만 작성

### 커밋 메시지
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 수정 (기능 변경 없음)
refactor: 코드 리팩토링
perf: 성능 개선
test: 테스트 추가
```

---

## 🐛 이슈 및 버그 리포트

버그를 발견했다면 [GitHub Issues](issues)에서 리포트해주세요.

---

## 📚 참고 자료

### 공식 문서
- [Next.js Documentation](https://nextjs.org/docs)
- [Notion API Documentation](https://developers.notion.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### 유사 프로젝트
- [Leerob's Blog](https://leerob.io/) - Notion + Next.js
- [Delba's Blog](https://delba.dev/) - Notion CMS 예시

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 👨‍💻 작성자

**개발자**: [Your Name]  
**GitHub**: [@yourusername](https://github.com/yourusername)  
**이메일**: leejy01022870502@gmail.com

---

## 🎯 다음 단계

이 프로젝트를 시작하려면:

1. [빠른 시작](#-빠른-시작) 섹션 따라하기
2. Notion 데이터베이스 설정
3. 첫 번째 글 작성 후 테스트
4. `docs/PRD.md`에서 상세 기능 확인

질문이나 제안사항이 있으면 이슈를 열어주세요! 🚀
