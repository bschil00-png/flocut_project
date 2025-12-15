# FLOCUT Backend

![Java](https://img.shields.io/badge/Java-17-007396?style=flat&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-JWT-6DB33F?style=flat&logo=springsecurity&logoColor=white)
![JPA](https://img.shields.io/badge/JPA-Hibernate-59666C?style=flat)
![MapStruct](https://img.shields.io/badge/MapStruct-DTO_Mapping-orange?style=flat)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=flat&logo=postgresql&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-API-E10098?style=flat&logo=graphql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Token_Cache-DC382D?style=flat&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Infra-2496ED?style=flat&logo=docker&logoColor=white)

---

## FLOCUT Backend

**문서·음성 기반 AI 요약 플랫폼 – Backend**

FLOCUT Backend는  
**GraphQL API 단일 인터페이스**를 기반으로  
인증, 사용자 관리, 요약 데이터 저장 및 이력 관리를 담당합니다.

Frontend는 UI/UX에 집중하고,  
Backend는 **도메인 규칙 · 인증 · 데이터 무결성**을 책임지는 구조로 설계되었습니다.

---

## Backend Overview

### 핵심 설계 방향

  → **GraphQL 단일 API 채택**
- 인증/인가 로직을 비즈니스 로직과 명확히 분리
- 도메인 중심 설계(DDD 지향)
- DTO ↔ Entity 변환 자동화(MapStruct)
- 확장 가능한 인증 구조 (JWT + Redis)

---

## Tech Stack

### Core

- **Language**: Java 17
- **Framework**: Spring Boot 3.x
- **Build Tool**: Gradle

### Security

- **Spring Security**
- **JWT 기반 인증**
  - Access Token / Refresh Token 분리
  - HttpOnly Cookie 기반 토큰 관리
- **Redis**
  - Refresh Token 저장 및 만료 관리 (확장 예정)

### Data & ORM

- **JPA (Hibernate)**
- **PostgreSQL**
- **MapStruct**
  - Request / Response DTO 매핑

### API

- **GraphQL**
  - 단일 Endpoint
  - Query / Mutation 기반 데이터 접근

### Infra

- **Docker**
- **Docker Compose**
  - PostgreSQL
  - Redis


