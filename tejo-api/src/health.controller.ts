import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from './prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async check(@Res() res: Response) {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        services: {
          database: 'connected',
          redis: 'unknown', // Will be enhanced with Redis health check
          meilisearch: 'unknown', // Will be enhanced with MeiliSearch health check
        },
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024),
        },
        system: {
          platform: process.platform,
          arch: process.arch,
          nodeVersion: process.version,
        },
      };

      return res.status(HttpStatus.OK).json(healthData);
    } catch (error) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {
          database: 'disconnected',
        },
      });
    }
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is ready to receive traffic' })
  async ready(@Res() res: Response) {
    try {
      // Check if database is ready
      await this.prisma.$queryRaw`SELECT 1`;
      
      return res.status(HttpStatus.OK).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  async live(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
}


