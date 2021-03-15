import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import Product from '../typeorm/entities/Product';
import RedisCache from '@shared/cache/RedisCache';

class ListProductService {
  public async execute(): Promise<Product[]> {
    const ProductsRepository = getCustomRepository(ProductRepository);

    const redisCache = new RedisCache();

    /* Verificar se existe a informação da listagem de produtos no Redis,
    se existir no Redis a lista de produto então é de lá que ele pega.
    Se não tiver no Redis, ele vai fazer o find no Repositório normal. */

    let products = await redisCache.recover<Product[]>(
      // Chave do cache
      'api-vendas-PRODUCTS_LIST',
    );

    if (!products) {
      // Listar produtos

      products = await ProductsRepository.find();

      // Se não existe Cache, se ele for buscado a gente cria ele aqui
      // Criando Cache para listagem de produtos
      await redisCache.save('api-vendas-PRODUCTS_LIST', products);
    }

    return products;
  }
}

export default ListProductService;
