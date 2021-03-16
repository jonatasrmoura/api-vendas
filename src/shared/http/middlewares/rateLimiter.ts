import { Request, Response, NextFunction } from 'express';

// Para poder está armazenando os endereços IPs e a quantidade de Requisições que foram feitas
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

// Definir um cliente(no caso um cliente radis)

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',

  // Números de requisições por segundos por IP(quantos que eu vou permidir)
  // (aqui cada usuário poderá fazer até 5 requisições por segundo, mais do que isso o sistema não vai permitir)
  points: 5,
  duration: 1, // segundos, 5 requisições por 1 segundo
});

// Criar a função Rete Limiter

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip); // O endereço IP de quem está Navegando fica dentro de request

    return next();
  } catch (err) {
    throw new AppError('Too many requests.', 429);
  }
}
