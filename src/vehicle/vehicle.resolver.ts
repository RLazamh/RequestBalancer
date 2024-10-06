import { Args, Query, Resolver, Context } from '@nestjs/graphql';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { Logger, OnModuleInit } from '@nestjs/common';
import { GraphQLInt } from 'graphql';
import { catchError, lastValueFrom, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { RedisCacheService } from '../cache/redis.service';
import { VehicleResponse } from './vehicle.schema';
import { ENDPOINTS_VEHICLE } from './endpoint';

@Resolver()
export class VehicleResolver implements OnModuleInit {
  EXSQUARED_SERVICE = process.env.EXSQUARED_SERVICE;
  private readonly logger: Logger;

  constructor(
    private readonly _httpService: HttpService,
    private readonly _redisCacheService: RedisCacheService,
  ) {
    this.logger = new Logger(VehicleResolver.name);
  }

  onModuleInit() {
    if (process.env.ENVIRONMENT === 'dev') {
      this.logger.log('Environment: Developer - Sending initial request');
      this.proccessVehicleData();
    }
  }

  @Query(() => [VehicleResponse], {
    description: 'Get vehicle details with pagination',
  })
  async vehicles(
    @Args('limit', { type: () => GraphQLInt, defaultValue: 100 }) limit: number,
    @Args('page', { type: () => GraphQLInt, defaultValue: 1 }) page: number,
    @Context() context,
  ): Promise<VehicleResponse[]> {
    const trackingId = context.req.headers['trackingid'];
    const cacheKey = `vehicles-${limit}-${page}`;

    try {
      const cachedData = await this._redisCacheService.get(cacheKey);
      if (cachedData) {
        this.logger.log(
          `Returning cached vehicle data - Tracking ID: ${trackingId} for limit: ${limit}, page: ${page} `,
        );
        return cachedData;
      }
      const endpointUrl = `${this.EXSQUARED_SERVICE}${ENDPOINTS_VEHICLE.fetchData(limit, page)}`;

      this.logger.log(
        `Fetching vehicle data - Tracking ID: ${trackingId}, Limit: ${limit}, Page: ${page}`,
      );

      const response = await lastValueFrom(
        this._httpService.get(endpointUrl, {
          headers: { trackingId },
        }),
      );

      this._redisCacheService.set(cacheKey, response.data);

      this.logger.log(
        `Successfully fetched vehicle data - Tracking ID: ${trackingId}`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch vehicle data - Tracking ID: ${trackingId}`,
        error.stack,
      );
      throw new Error('Failed to fetch vehicle data');
    }
  }

  @Cron(CronExpression.EVERY_3_HOURS)
  proccessVehicleData() {
    const trackingId = uuidv4();
    const endpointUrl = `${this.EXSQUARED_SERVICE}${ENDPOINTS_VEHICLE.proccessXml()}`;

    this.logger.log(`Init proccess-xml endpoint - Tracking ID: ${trackingId}`);

    this._httpService
      .post(endpointUrl, null, {
        headers: { trackingId },
      })
      .pipe(
        catchError((error) => {
          this.logger.error(
            `Error sending request - Tracking ID: ${trackingId}`,
            error.message,
          );
          return of(null);
        }),
      )
      .subscribe();

    this.logger.log(
      `Successfully fetched XML data - Tracking ID: ${trackingId}`,
    );
  }
}
