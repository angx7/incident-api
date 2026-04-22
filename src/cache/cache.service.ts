import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from 'src/config/envs';

@Injectable()
export class CacheService {
  private readonly redis = new Redis({
    host: envs.REDIS_HOST || 'localhost',
    port: envs.REDIS_PORT || 6379,
  });

  set(key: string, value: any) {
    this.redis.set(key, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;
    const object = JSON.parse(data) as T;
    return object;
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}
