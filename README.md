# nest OAuth login 구현

## 목차
1. OAuth 2.0 기본적인 이해
2. nest 프로젝트 생성, 기본 설정
3. OAuth login 구현 (google)
4. JWT 설정

## 1. OAuth 2.0 기본적인 이해

- OAuth 2.0이란?
    - 리소스 소유자가 제 3의 서비스(third party)에 자신의 일부 자원에 대한 제한적 접근 권한을 위임할 수 있도록 도와주는 프로토콜. 주로 소셜 로그인을 구현할 때 사용한다.
    - 리소스 사용자(Resource Owner)가 인증 서버(Authorization Server)에 인증을 받고 얻은 자격(보통 Token)을 통해 서비스 제공자(Client)에게 자신의 자원이 존재하는 서버(Resource Server)에 요청이 가능하도록 하는 것이다.

- OAuth 권한 부여 방식 종류
    - 권한 부여 승인 코드 방식 (Authorization Code Grant)
        - 많이 쓰이고 기본이 되는 방식. 주로 간편 로그인 기능에서 사용한다.
        - 사용자가 인증 서버에서 제공하는 로그인 페이지에서 로그인을 진행하면 클라이언트가 설정한 redirect_url로 인가 코드(Authorization Code)를 전달하고, 클라이언트는 인가 코드를 인증 서버에 제출하여 사용자의 데이터에 대한 접근 권한 토큰(Access Token)을 부여받는다.
    - 암묵적 승인 방식 (Implicit Grant)
        - 권한 부여 승인 코드 방식에서 사용자 로그인 후 제공된 인가 코드를 바탕으로 접근 토큰을 얻는 과정이 생략되어 바로 접근 토큰을 부여하는 방식.
        - 절차의 간소화로 응답성과 효율성은 높아지지만, 접근 권한 토큰이 URL에 직접적으로 노출되기에 토큰 유출과 보관에 신경을 써야한다.
    - 자원 소유자 자격증명 승인 방식 (Resource Owner Password Credentials Grant)
        - 사용자의 ID와 Password를 통해 Access Token을 받는 방식.
        - OAuth 인증 서버 대신 클라이언트에서 직접 아이디/비밀번호를 입력하기 때문에 자사의 프로그램에 대해서만 사용을 고려해볼만 하지, 타사의 외부 프로그램일 경우 해당 방식의 사용은 비추천한다.
        - 소셜 로그인 구현을 할 때에는 고려할 필요가 없는 방식.
    - 클라이언트 자격증명 승인 방식 (Client Credentials Grant)
        - 사용자가 인증을 받는 것이 아닌 클라이언트가 인증을 하기 위해 사용하는 방식.
        - 클라이언트가 자체 자원에 접근하거나, 단순히 서비스 간 통신이 필요할 경우 사용하는 방식이다.
        - 사용자의 소셜 로그인 구현이 필요한 경우에는 고려하지 않아도 괜찮다.

- 이번 프로젝트에서는 백엔드 서버가 존재하여 보안에 취약한 암묵적 승인 방식 (Implicit Grant)이 아닌 권한 부여 승인 코드 방식 (Authorization Code Grant)로 진행하겠다.
    -  소셜 로그인을 구현하는 것이 중점이고, 추가적인 접근을 하지 않을 것이기에 Access Token을 저장하지는 않을 예정이다.
    - 회원 정보 저장을 위해 PostgreSQL을 사용할 예정이다.

## 2. nest 프로젝트 생성, 기본 설정

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
    - ``pnpm add passport passport-google-oauth20 @nestjs/passport @nestjs/jwt passport-jwt``<br/>
        * passport : 인증을 위한 미들웨어
        * passport-google-oauth20: 구글 OAuth 2.0 전략
        * @nestjs/passport: NestJS에서 Passport를 간편하게 쓸 수 있게 해주는 공식 모듈
        * @nestjs/jwt : NestJS에서 JWT 기반 인증을 쉽게 구현할 수 있도록 제공되는 공식 모듈
        * passport-jwt : JWT 전략(Strategy)을 지원하기 위한 플러그인

2. 환경 변수 추가
    ```
    GOOGLE_CLIENT_ID= {구글OAuth클라이언트아이디}
    GOOGLE_CLIENT_SECRET={구글OAuth클라이언트시크릿}
    GOOGLE_CALLBACK_URL=http://{주소(localhost:3000)}/auth/google/callback

    ```