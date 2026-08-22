import { Body, Controller, Get, Post, Query, Module } from "@nestjs/common";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { PrismaModule } from "../prisma/prisma.module";
import { LabourService } from "./labour.service";

@Controller("labour")
export class LabourController {
  constructor(private readonly svc: LabourService) {}

  // Workforce
  @Get("workers") workers(@CurrentUser() u: AuthContext) {
    return this.svc.workers(u.organisationId);
  }
  @Post("workers") createWorker(@CurrentUser() u: AuthContext, @Body() body: { code: string; name: string; trade: string; grade?: string; dayRate: number; phone?: string }) {
    return this.svc.createWorker(u.organisationId, body);
  }

  // Allocation
  @Get("allocations") allocations(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) {
    return this.svc.allocations(u.organisationId, projectId);
  }
  @Post("allocations") allocate(@CurrentUser() u: AuthContext, @Body() body: { projectId: string; trade: string; plannedHeadcount: number; zone?: string; supervisor?: string; startDate: string; endDate?: string; workerId?: string }) {
    return this.svc.allocateCrew(u.organisationId, { ...body, startDate: new Date(body.startDate), endDate: body.endDate ? new Date(body.endDate) : undefined });
  }

  // Attendance
  @Get("attendance") attendance(@CurrentUser() u: AuthContext, @Query("projectId") projectId: string, @Query("date") date: string) {
    return this.svc.attendance(u.organisationId, projectId, new Date(date));
  }
  @Post("attendance") mark(@CurrentUser() u: AuthContext, @Body() body: { projectId: string; workerId: string; date: string; status: any; hours: number; overtimeHours?: number }) {
    return this.svc.markAttendance(u.organisationId, { ...body, date: new Date(body.date) });
  }

  // Engine-driven deployment summary for a date (defaults to today)
  @Get("deployment") deployment(@CurrentUser() u: AuthContext, @Query("date") date?: string) {
    return this.svc.deployment(u.organisationId, date ? new Date(date) : new Date());
  }

  // Weekly timesheets aggregated from attendance over a date range
  @Get("timesheets") timesheets(@CurrentUser() u: AuthContext, @Query("from") from: string, @Query("to") to: string) {
    return this.svc.timesheets(u.organisationId, new Date(from), new Date(to));
  }

  // Charge-out rate card
  @Get("rates") rates(@CurrentUser() u: AuthContext) {
    return this.svc.rates(u.organisationId);
  }
}

@Module({
  imports: [PrismaModule],
  controllers: [LabourController],
  providers: [LabourService],
})
export class LabourModule {}
