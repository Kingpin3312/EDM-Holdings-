import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";

// Verifies Supabase-issued access tokens, then loads the EDM user + role.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SUPABASE_JWT_SECRET ?? "dev-secret",
    });
  }

  // payload.sub is the Supabase user id; map to our User + membership.
  async validate(payload: { sub: string; email?: string }) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ supabaseId: payload.sub }, { email: payload.email ?? "" }] },
      include: { memberships: true },
    });
    if (!user || !user.isActive) throw new UnauthorizedException();
    const membership = user.memberships[0];
    return {
      userId: user.id,
      email: user.email,
      organisationId: user.organisationId,
      role: membership?.role ?? "ADMINISTRATOR",
    };
  }
}
