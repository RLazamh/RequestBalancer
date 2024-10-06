import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TrackingIdInterceptor } from '../../../src/interceptors/tracking.interceptor';
import { of } from 'rxjs';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('TrackingIdInterceptor (unit test)', () => {
  let interceptor: TrackingIdInterceptor;
  let context: ExecutionContext;
  let callHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackingIdInterceptor],
    }).compile();

    interceptor = module.get<TrackingIdInterceptor>(TrackingIdInterceptor);

    callHandler = {
      handle: jest.fn(() => of(null)),
    };
  });

  it('GIVEN a request in GraphQL context WHEN the interceptor is called THEN it should add a tracking ID to headers', () => {
    const mockRequest = { headers: {} };
    const gqlContext = { req: mockRequest };

    jest.spyOn(GqlExecutionContext, 'create').mockReturnValue({
      getContext: () => gqlContext,
    } as GqlExecutionContext);

    context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(null),
      }),
    } as unknown as ExecutionContext;

    interceptor.intercept(context, callHandler);

    expect(mockRequest.headers['trackingid']).toBe('mock-uuid');
    expect(callHandler.handle).toHaveBeenCalled();
  });
});
