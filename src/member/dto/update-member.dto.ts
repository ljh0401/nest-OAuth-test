import { PartialType } from "@nestjs/mapped-types";
import { CreateMemberDto } from "./create-member.dto";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { ProviderRole, RoleRole } from "../entities/member.entity";

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ProviderRole)
  @IsOptional()
  provider?: ProviderRole;

  @IsEnum(RoleRole)
  @IsOptional()
  role?: RoleRole;
}
