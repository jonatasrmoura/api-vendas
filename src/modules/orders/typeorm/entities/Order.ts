import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Customer from '@modules/customers/typeorm/entities/Customer';
import OrdersProducts from './OrdersProducts';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // um cliente para cada ordem(pedido)
  // Muitas ordens pode ser de um único cliente -> muitas ordens para um customer
  @ManyToOne(() => Customer) // ManyToOne está sendo relacionado com Customer
  @JoinColumn({ name: 'customer_id' }) // qual é a coluna que está fazendo essa únião fazendo essa referência, essa é a coluna que faz a junção de um cliente com muitas ordens
  customer: Customer;

  //Uma order(pedido) ele pode está relacionado com muitos registros da tabela pivo
  @OneToMany(() => OrdersProducts, order_products => order_products.order, {
    cascade: true, // toda vez que eu fizer uma order(dar um save) todos os ordersProducts relacionados a essa order já vão ser salvos automaticamente no banco de dados
  })
  order_products: OrdersProducts[]; // como ele pode ter uma ordem ta relacionada a muitos order_products então eu uso o array de order_products

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
