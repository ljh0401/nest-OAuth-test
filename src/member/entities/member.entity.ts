import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

export enum ProviderRole {
  FORM = "form",
  GOOGLE = "google",
  KAKAO = "kakao",
}

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  nickname: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: "enum",
    enum: ProviderRole,
   })
  provider: ProviderRole;
}
