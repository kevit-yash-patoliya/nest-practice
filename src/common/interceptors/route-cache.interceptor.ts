import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class RouteCacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request>();

    // Caching is only applicable for GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Cache key based on the route URL (including query parameters)
    const cacheKey = `route_cache:${request.url}`;

    try {
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData !== undefined && cachedData !== null) {
        console.log(`[RouteCache] Cache HIT for key: ${cacheKey}`);
        return of(cachedData);
      }
    } catch (error) {
      console.error(`[RouteCache] Cache read error for key ${cacheKey}:`, error);
    }

    console.log(`[RouteCache] Cache MISS for key: ${cacheKey}. Fetching from controller...`);
    console.log(request.url,'url')
    return next.handle().pipe(
      tap(async (data) => {
        try {
          // Store response in cache (TTL is in milliseconds for modern cache-manager, e.g., 10000ms = 10s)
          await this.cacheManager.set(cacheKey, data, 10000);
        } catch (error) {
          console.error(`[RouteCache] Cache write error for key ${cacheKey}:`, error);
        }
      }),
    );
  }
}
