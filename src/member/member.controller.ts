import { Controller, Get, Post, Patch, Body, Param } from "@nestjs/common";
import { MemberService } from "./member.service";
import { CreateMemberDto, UpdateMemberDto } from "./dto";
import { Member } from "./entities";

@Controller("member")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // 회원 조회 (이메일 기준)
  @Get(":email")
  async getMember(@Param("email") email: string): Promise<Member | null> {
    return this.memberService.findByEmail(email);
  }

  // 회원 가입
  @Post()
  async createMember(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberService.create(createMemberDto);
  }

  // 회원 정보 업데이트
  @Patch(":email")
  async updateMember(
    @Param("email") email: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    return this.memberService.update(email, updateMemberDto);
  }
}
