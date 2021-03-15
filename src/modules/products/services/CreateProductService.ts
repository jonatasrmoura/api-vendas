import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import Product from '../typeorm/entities/Product';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const ProductsRepository = getCustomRepository(ProductRepository);
    const productExists = await ProductsRepository.findByName(name);

    if (productExists) {
      throw new AppError('There is already one product with this name!');
    }

    const redisCache = new RedisCache();

    const product = ProductsRepository.create({
      name,
      price,
      quantity,
    });

    // Invalidando cache
    // Invalidar, o proximo client vai reecriar o chache, pegando do banco de dados

    await redisCache.invalidate('api-vendas-PRODUCTS_LIST');

    await ProductsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
