import { Controller, Get, Inject } from '@nestjs/common';
import {
  DiskHealthIndicator, HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator, MicroserviceHealthIndicator,
  PrismaHealthIndicator
} from '@nestjs/terminus';
import { ConfigType } from '@nestjs/config';
import { redisConfig } from '@mn/project-one/server/configs';
import { ApiTags } from '@nestjs/swagger';
import { SuperAdminRoleId, ServerRouting } from '@mn/project-one/shared/models';
import { AuthAndRole } from '@mn/project-one/server/guards';
import { RepoOneService } from '@mn/project-one/server/repos/repo-one';
import { Transport, RedisOptions } from '@nestjs/microservices';

@ApiTags(ServerRouting.health.capitalizedPath)
@AuthAndRole(SuperAdminRoleId)
@Controller(ServerRouting.health.absolutePath())
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private repoOneService: RepoOneService,
    private db: PrismaHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    @Inject(redisConfig.KEY) private config: ConfigType<typeof redisConfig>
  ) {}

  @HealthCheck()
  @Get()
  check() {
    return this.health.check([
      () => this.http.pingCheck('google', 'https://google.com', { timeout: 800 }),
      () => this.db.pingCheck('database', this.repoOneService),
      // Our current instance has 160GB of storage so if have used 100GB we should warn (run `df -H` on server to view disk size, used, available)
      () => this.disk.checkStorage('storage', { path: '/', threshold: 100 * 1024 * 1024 * 1024 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.microservice.pingCheck<RedisOptions>('redis', {
        transport: Transport.REDIS,
        options: {
          host: this.config.host,
          port: this.config.port,
          password: this.config.password
        },
      })
    ]);
  }
}
