import { Module } from '@nestjs/common';
import { VehicleResolver } from './vehicle.resolver';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from '../cache/redis.module';

@Module({
  imports: [HttpModule, RedisModule],
  providers: [VehicleResolver],
})
export class VehicleModule {}
