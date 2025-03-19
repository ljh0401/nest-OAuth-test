import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Member } from "./entities";
import { CreateMemberDto, UpdateMemberDto } from "./dto";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>
  ) {}

  // 회원 조회 (이메일 기준)
  async findByEmail(email: string): Promise<Member | null> {
    return this.memberRepository.findOne({ where: { email } });
  }

  // 회원 생성
  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const newMember = this.memberRepository.create(createMemberDto);
    return this.memberRepository.save(newMember);
  }

  // 회원 정보 업데이트
  async update(email: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findByEmail(email);
    if (!member) {
      throw new Error("해당 이메일의 사용자가 존재하지 않습니다.");
    }
    
    Object.assign(member, updateMemberDto);
    return this.memberRepository.save(member);
  }
}
