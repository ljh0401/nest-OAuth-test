import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
} from "typeorm";

// provider enum 기준
export enum ProviderRole {
  GOOGLE = "google",
  KAKAO = "kakao",
}

// role enum 기준
export enum RoleRole {
  PARANT = "parant",
  CHILD = "child",
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

  @Column({ type: "enum",
    enum: ProviderRole,
   })
  provider: ProviderRole;

  @Column({ type: "enum",
    enum: RoleRole, 
  })
  role: RoleRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
