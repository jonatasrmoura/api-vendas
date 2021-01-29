import { EntityRepository, Repository } from 'typeorm';

import Order from '../entities/Order';
import Customer from '@modules/customers/typeorm/entities/Customer';

interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer: Customer;
  products: IProduct[];
}

@EntityRepository(Order)
class OrdersRepository extends Repository<Order> {
  public async findById(id: string): Promise<Order | undefined> {
    const order = this.findOne(id, {
      /* Traser todos os dados da order(pedido) ele também vai traser os dados relacionados a esse pedido desse id(order) dos
      cliente com todos os dados dele e quais produtos foram comprados por esse cliente */
      relations: ['order_products', 'customer'],
    });

    return order;
  }

  // Para criar um pedido informa, Quais dados que são enviados pela requisição do cliente do usuário
  // criar um pedido  (retorna um pedido)
  public async createOrder({ customer, products }: IRequest): Promise<Order> {
    const order = this.create({
      customer,
      order_products: products, // produtos que estão sendo comprados
    });

    await this.save(order);

    return order;
  }
}

export default OrdersRepository;
