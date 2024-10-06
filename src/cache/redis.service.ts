import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private _cacheManager: Cache,
  ) {}

  async get(key: string): Promise<any> {
    return await this._cacheManager.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const timeToLive = ttl || +process.env.REDIS_TTL || 600;
    await this._cacheManager.set(key, value, timeToLive);
  }

  async del(key: string): Promise<void> {
    await this._cacheManager.del(key);
  }
}
