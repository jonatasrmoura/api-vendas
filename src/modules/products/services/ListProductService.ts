import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import Product from '../typeorm/entities/Product';

class ListProductService {
  public async execute(): Promise<Product[]> {
    const ProductsRepository = getCustomRepository(ProductRepository);

    const products = ProductsRepository.find();

    return products;
  }
}

export default ListProductService;
