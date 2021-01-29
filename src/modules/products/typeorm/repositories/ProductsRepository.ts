import { EntityRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  public async findByName(name: string): Promise<Product | undefined> {
    const product = this.findOne({
      where: {
        name,
      },
    });

    return product;
  }

  // Verificar se a lista de pedidos do cliente é válida.
  // aonde eu vou ter o id de cada produto daquele pedido de compra
  public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const existsProducts = await this.find({
      where: {
        // vai pegar e pesquisar um id de produtos dentro de uma lista(minha lista de array productIds)
        id: In(productIds), // vai checar para ver se esse produto existe no meu repositório
      },
    });

    // retorna os que existem
    return existsProducts;
  }
}
