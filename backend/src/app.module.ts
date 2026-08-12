import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './websocket/gateway/events.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RoadsModule } from './modules/roads/roads.module';
import { IntersectionsModule } from './modules/intersections/intersections.module';
import { TrafficModule } from './modules/traffic/traffic.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { CitizenReportsModule } from './modules/citizen-reports/citizen-reports.module';
import { RoutingModule } from './modules/routing/routing.module';
import { PredictionsModule } from './modules/predictions/predictions.module';
import { SignalsModule } from './modules/signals/signals.module';
import { SignalRecommendationsModule } from './modules/signal-recommendations/signal-recommendations.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { SimulationModule } from './modules/simulation/simulation.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ReportsModule } from './modules/reports/reports.module';
import { DataSourcesModule } from './modules/data-sources/data-sources.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CvModule } from './modules/cv/cv.module';

import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    EventsModule,
    AuditLogsModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RoadsModule,
    IntersectionsModule,
    TrafficModule,
    IncidentsModule,
    CitizenReportsModule,
    RoutingModule,
    PredictionsModule,
    SignalsModule,
    SignalRecommendationsModule,
    EmergencyModule,
    SimulationModule,
    AnalyticsModule,
    ReportsModule,
    DataSourcesModule,
    NotificationsModule,
    CvModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
