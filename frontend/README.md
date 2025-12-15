# FLOCUT Frontend

**문서·음성 기반 AI 요약 플랫폼**

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat&logo=redux&logoColor=white)
![Apollo](https://img.shields.io/badge/Apollo_Client-311C87?style=flat&logo=apollographql&logoColor=white)

---

> 문서와 음성을 가장 빠르게 이해하는 방법  
> 기록 → 이해 → 정리 → 재활용의 흐름을 만드는 AI 노트 플랫폼

---
### 목표

- SaaS 스타일 랜딩 페이지 구성
- GraphQL 기반 API 연동 전제 UI 설계
- 다크모드 + 컬러 테마 지원
---

## Tech Stack

### Core

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Theme & UI

- **Dark Mode**: next-themes
- **Color Theme**: CSS Variables + Tailwind Design Tokens
- **Font**: Noto Sans (Global Default)

### State / Data

- **State Management**: Redux Toolkit (UI State)
- **API Communication**: GraphQL
    - Apollo Client 연동 예정

---

## Development Log (Frontend)

> 약 1개월 개발 예정

### 2025.12.08 ~ 2025.12.11 — 기획 & 설계

- 프로젝트 주제 선정 및 서비스 기획
- 요구사항 정의서 및 기능 목록 정리
- 테이블 정의 및 관계 설계
    - 히스토리 테이블 / 뷰 테이블 포함 약 20개 테이블
- DB 다이어그램을 통한 구조 시각화
- 컴포넌트 정의서 및 기술 스택(라이브러리) 정리

### 2025.12.12 — Project Setup & UI Foundation

- 프로젝트 초기 세팅
    - Next.js 보안 이슈 대응을 위한 버전 검토 및 조정
- Tailwind CSS 기반 디자인 시스템 구성
- 다크모드 및 컬러 테마 구조 확정

### 2025.12.13 — Auth UI & Common Components (1)

- 로그인 / 회원가입 UI 구현
- 공용 Button / Input / Card 컴포넌트 정리

### 2025.12.14 — Common Components (2) & Error Pages

- 공용 컴포넌트 구조 정리
- 404 / 500 에러 페이지 추가
