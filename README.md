# nest login 구현

## 목차
1. nest 프로젝트 생성, 기본 설정
2. OAuth login 구현
3. form login 구현
4. JWT 설정

## 1. nest 프로젝트 생성, 기본 설정

1. 프로젝트 생성<br />
    ``nest new [프로젝트 명]``, package manager 선택 (해당 프로젝트에서는 pnpm 사용)

2. .prettierrc 설정<br />
    ``` 
    {
    "singleQuote": false, 
    "trailingComma": "all",
    "printWidth": 100,
    "tabWidth": 2,
    "semi": true,
    "endOfLine": "lf",
    "plugins": ["prettier-plugin-tailwindcss"]
    }
    ```
    - "singleQuote": false -> 작은 따옴표(') 대신 큰 따옴표(") 사용
    - "trailingComma": "all" -> 가능한 모든 곳에 후행쉼표 추가
    - printWidth: 100 -> 한 줄의 최대 길이 100자로 제한
    - tabWidth: 2 -> 들여쓰기(탭)을 2칸의 공백으로 설정
    - semi: true -> 세미콜론(;) 항상 추가
    - endOfLine: "lf" -> 줄바꿈 스타일을 "lf"로 설정 (협업 시, 배포 시를 위해)
    - plugins: ["prettier-plugin-tailwindcss"] -> 테스트 시 Tailwind의 클래스 정렬 자동화를 위해

3. 의존성 추가
    - ``pnpm add @nestjs/typeorm typeorm pg``
        PostgreSQL 데이터베이스 드라이버 'pg'와 좀 더 쉬운 db 관리를 위한 'typeorm'
    - ``pnpm add @nestjs/config``
        환경 변수 설정을 위한 의존성
    - ``pnpm add @nestjs/mapped-types``
        DTO를 좀 더 쉽게 활용하기 위한 의존성
    - ``pnpm add class-transformer``
        데이터를 주고 받을 때 객체 변환을 쉽게 하도록 도와주는 의존성 ('reflect-metadata' 주입이 필요하나 typeorm 의존성 설정할 때 같이 주입됨됨)
    - ``pnpm add class-validator``
        DTO에 유효성 검사를 적용하도록 해주는 의존성


## 2. OAuth 로그인 구현 ()