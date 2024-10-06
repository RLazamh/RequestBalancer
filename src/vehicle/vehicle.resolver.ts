import { Args, Query, Resolver } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { GraphQLInt } from 'graphql';
import { lastValueFrom } from 'rxjs';
import { VehicleResponse } from './vehicle.schema';

@Resolver()
export class VehicleResolver {
  constructor(private readonly httpService: HttpService) {}

  @Query(() => [VehicleResponse], {
    description: 'Get vehicle details with pagination',
  })
  async vehicles(
    @Args('limit', { type: () => GraphQLInt, defaultValue: 100 }) limit: number,
    @Args('page', { type: () => GraphQLInt, defaultValue: 1 }) page: number,
  ): Promise<VehicleResponse[]> {
    try {
      const endpointUrl = `http://127.0.0.1:3000/vehicle/fetch-data?limit=${limit}&page=${page}`;
      const response = this.httpService.get(endpointUrl);
      const vehiclesData = await lastValueFrom(response);
      return vehiclesData.data;
    } catch (e) {
      console.log(`Unexpected error occurred: ${JSON.stringify(e)}`);
      throw new Error('Failed to fetch vehicle data');
    }
  }
}
