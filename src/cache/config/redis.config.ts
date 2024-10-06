import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

@Injectable()
export class RedisConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      ttl: parseInt(process.env.REDIS_TTL, 10),
      password: process.env.REDIS_PASSWORD,
    };
  }
}
