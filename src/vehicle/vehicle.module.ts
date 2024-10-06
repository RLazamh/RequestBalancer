import { Module } from '@nestjs/common';
import { VehicleResolver } from './vehicle.resolver';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [VehicleResolver],
})
export class VehicleModule {}
