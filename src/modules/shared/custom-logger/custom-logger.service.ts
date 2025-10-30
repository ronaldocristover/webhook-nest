import { Injectable, LoggerService } from '@nestjs/common';
const LokiTransport = require('winston-loki');
import * as winston from 'winston';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
dotenv.config();

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(private configService: ConfigService) {
    const env = this.configService.getOrThrow<string>('env');
    const transports = [];

    transports.push(
      new LokiTransport({
        host: this.configService.getOrThrow<string>('grafana_url'),
        labels: {
          app: this.configService.getOrThrow<string>('app_name'),
          env,
        },
        json: true,
      }),
      new winston.transports.Console({
        format: winston.format.json(),
      }),
    );

    this.logger = winston.createLogger({
      level: env === 'production' ? 'error' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.errors({ stack: true }),
      ),
      transports,
    });
  }

  log(message: string, meta: any = {}) {
    this.logger.info(message, { meta });
  }

  error(message: string, trace: any) {
    this.logger.error(message, { trace });
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string, data?: any) {
    this.logger.debug(message, { data });
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
