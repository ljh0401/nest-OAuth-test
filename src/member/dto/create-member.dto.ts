import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ProviderRole, RoleRole } from "../entities/member.entity";

export class CreateMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ProviderRole)
  provider: ProviderRole;

  @IsEnum(RoleRole)
  role: RoleRole;
}
  