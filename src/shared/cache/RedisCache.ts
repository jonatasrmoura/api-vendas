/**
 * @fileoverview Implementado configuração de Cache
 */

import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

export default class RedisCache {
  private client: RedisClient;

  constructor() {
    // Aonde está as configuração das variáveis de ambiente para o Redis
    this.client = new Redis(cacheConfig.config.redis);
  }

  // Salvar Cache

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  // Buscar infórmação get / (recuperar informação)

  public async recover<T>(key: string): Promise<T | null> {
    // Buscar a informação do parâmetro key
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  // Excluir o Cache

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }
}
