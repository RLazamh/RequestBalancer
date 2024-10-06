import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TrackingIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const gqlContext = GqlExecutionContext.create(context);

    const request = httpContext.getRequest() || gqlContext.getContext().req;

    if (request) {
      const trackingId = uuidv4();
      request.headers['trackingid'] = trackingId;
      Logger.log(`Tracking ID added to request: ${trackingId}`);
    }

    return next.handle();
  }
}
