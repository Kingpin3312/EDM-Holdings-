import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";

// Verifies Supabase-issued access tokens, then loads the EDM user + role.
//
// Identity is resolved on the token subject ONLY. Matching on the email claim as
// well would mean anyone holding a validly signed token whose email happened to
// match an EDM address could sign in as that user, so the email is used to link
// an account exactly once — on first sign-in, when no supabaseId is recorded yet —
// and the link is written back so it is never used for lookup again.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const secret = process.env.SUPABASE_JWT_SECRET;
    // No silent "dev-secret" fallback: a forgeable signing key must be a
    // deliberate, visible choice, not what happens when a variable is missing.
    if (!secret) {
      throw new Error(
        "SUPABASE_JWT_SECRET is not set. The API will not start without a token signing key.",
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub?: string; email?: string }) {
    if (!payload?.sub) throw new UnauthorizedException();

    let user = await this.prisma.user.findFirst({
      where: { supabaseId: payload.sub },
      include: { memberships: true },
    });

    // First sign-in: an account provisioned by email but not yet linked to a
    // Supabase identity. Claim it once, then rely on supabaseId from here on.
    if (!user && payload.email) {
      const unlinked = await this.prisma.user.findFirst({
        where: { email: payload.email, supabaseId: null },
        include: { memberships: true },
      });
      if (unlinked) {
        await this.prisma.user.update({
          where: { id: unlinked.id },
          data: { supabaseId: payload.sub },
        });
        user = unlinked;
      }
    }

    if (!user || !user.isActive) throw new UnauthorizedException();

    // Role and organisation must come from the SAME membership. Taking the role
    // from memberships[0] while scoping data by user.organisationId can apply one
    // organisation's role to another organisation's records.
    const membership =
      user.memberships.find((m) => m.organisationId === user!.organisationId) ?? null;

    // Fail closed. A user with no membership in their organisation has no role —
    // defaulting to ADMINISTRATOR hands full rights to an unconfigured account.
    if (!membership) throw new UnauthorizedException("No active membership for this organisation");

    return {
      userId: user.id,
      email: user.email,
      organisationId: membership.organisationId,
      role: membership.role,
    };
  }
}
