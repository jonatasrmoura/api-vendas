import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const ProductsRepository = getCustomRepository(ProductRepository);

    const product = await ProductsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found.');
    }

    // Invalidando cache

    const redisCache = new RedisCache();

    await redisCache.invalidate('api-vendas-PRODUCTS_LIST');

    await ProductsRepository.remove(product);
  }
}

export default DeleteProductService;
