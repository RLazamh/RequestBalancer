import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { RedisCacheService } from '../../../src/cache/redis.service';
import { VehicleResolver } from '../../../src/vehicle/vehicle.resolver';
import { of } from 'rxjs';

describe('VehicleResolver (unit test)', () => {
  let resolver: VehicleResolver;
  let httpService: HttpService;
  let redisCacheService: RedisCacheService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleResolver,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: RedisCacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = moduleFixture.get<VehicleResolver>(VehicleResolver);
    httpService = moduleFixture.get<HttpService>(HttpService);
    redisCacheService = moduleFixture.get<RedisCacheService>(RedisCacheService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('vehicles', () => {
    it('GIVEN cached data is available WHEN vehicles query is called THEN it should return the cached data', async () => {
      const mockVehicleData = [{ make: 'Toyota', vehicleType: 'SUV' }];
      const cacheKey = 'vehicles-100-1';

      (redisCacheService.get as jest.Mock).mockResolvedValue(mockVehicleData);

      const result = await resolver.vehicles(100, 1, {
        req: { headers: { trackingid: '123' } },
      });

      expect(redisCacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(result).toEqual(mockVehicleData);
    });

    it('GIVEN cache is empty WHEN vehicles query is called THEN it should fetch data from the external API and cache it', async () => {
      const mockVehicleData = [{ make: 'Toyota', vehicleType: 'SUV' }];
      const mockResponse = { data: mockVehicleData };
      const cacheKey = 'vehicles-100-1';
      const endpointUrl =
        'http://127.0.0.1:3000/vehicle/fetch-data?limit=100&page=1';

      (redisCacheService.get as jest.Mock).mockResolvedValue(null); // Cache is empty
      (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));

      const result = await resolver.vehicles(100, 1, {
        req: { headers: { trackingid: '123' } },
      });

      expect(redisCacheService.get).toHaveBeenCalledWith(cacheKey);
      expect(httpService.get).toHaveBeenCalledWith(endpointUrl, {
        headers: { trackingId: '123' },
      });
      expect(redisCacheService.set).toHaveBeenCalledWith(
        cacheKey,
        mockVehicleData,
      );
      expect(result).toEqual(mockVehicleData);
    });
  });
});
