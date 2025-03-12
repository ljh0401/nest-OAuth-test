# nest OAuth login 구현

## 목차
1. OAuth 기본적인 이해
2. nest 프로젝트 생성, 기본 설정
3. OAuth login 구현 (google)
4. JWT 설정

## 1. nest 프로젝트 생성, 기본 설정

1. 프로젝트 생성<br />
    ``nest new [프로젝트 명] --package-manager=pnpm``(해당 프로젝트에서는 pnpm 사용)

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
    - ``pnpm add @nestjs/typeorm typeorm pg``<br/>
        PostgreSQL 데이터베이스 드라이버 'pg'와 좀 더 쉬운 db 관리를 위한 'typeorm'
    - ``pnpm add @nestjs/config``<br/>
        환경 변수 설정을 위한 의존성
    - ``pnpm add @nestjs/mapped-types``<br/>
        DTO를 좀 더 쉽게 활용하기 위한 의존성
    - ``pnpm add class-transformer``<br/>
        데이터를 주고 받을 때 객체 변환을 쉽게 하도록 도와주는 의존성 ('reflect-metadata' 주입이 필요하나 typeorm 의존성 설정할 때 같이 주입됨)
    - ``pnpm add class-validator``<br/>
        DTO에 유효성 검사를 적용하도록 해주는 의존성


## 2. OAuth 로그인 구현 (google)

1. 의존성 추가
    - ``pnpm add passport passport-google-oauth20 @nestjs/passport``<br/>
        * passport : 인증을 위한 미들웨어
        * passport-google-oauth20: 구글 OAuth 2.0 전략
        * @nestjs/passport: NestJS에서 Passport를 간편하게 쓸 수 있게 해주는 공식 모듈

2. 환경 변수 추가
    ```
    GOOGLE_CLIENT_ID= {구글OAuth클라이언트아이디}
    GOOGLE_CLIENT_SECRET={구글OAuth클라이언트시크릿}
    GOOGLE_CALLBACK_URL=http://{주소(localhost:3000)}/auth/google/callback

    ```