import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Throttler que usa la IP real detrás del proxy (trust proxy está activo en
 * main.ts). Sin esto, todas las peticiones tras el proxy compartirían límite.
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return (req.ips?.length ? req.ips[0] : req.ip) as string;
  }
}
