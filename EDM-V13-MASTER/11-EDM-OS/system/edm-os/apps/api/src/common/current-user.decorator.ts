import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface AuthContext {
  userId: string;
  email: string;
  organisationId: string;
  role: string;
}

// Injects the authenticated user + tenant context into a handler.
export const CurrentUser = createParamDecorator(
  (_data, ctx: ExecutionContext): AuthContext => ctx.switchToHttp().getRequest().user,
);
