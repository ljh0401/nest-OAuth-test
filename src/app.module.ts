import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemberModule } from "./member";
import { Member } from "./member/entities";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 환경 변수 사용 가능하게 설정
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL, // .env 파일에서 DB URL 읽기
      autoLoadEntities: true, // 엔티티 자동 로드
      synchronize: true, // 개발 환경에서 DB 스키마 자동 동기화 (운영 환경에서는 비활성화 필요)
    }),
    TypeOrmModule.forFeature([Member]), // Member 엔티티 등록
    MemberModule, // Member 모듈 등록
  ],
})
export class AppModule {}
