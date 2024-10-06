import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfigService } from './config/redis.config';
import { RedisCacheService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: RedisConfigService,
    }),
  ],
  exports: [RedisCacheService],
  providers: [RedisCacheService],
})
export class RedisModule {}
