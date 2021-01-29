import { getCustomRepository } from 'typeorm';
import OrdersRepository from '../typeorm/repositories/OrdersRepository';

import Order from '../typeorm/entities/Order';
import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

// Criação dos pedidos de compras

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    const customerExists = await customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id.');
    }

    // pegando produtos que foram encontrados(no repositorio de produtos)
    const existsProducts = await productsRepository.findAllByIds(products);

    // se tem tamanho se tem conteúdo dentro dele, a verificação é negando isso(se não tem nada vai dar um erro)
    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the given ids.');
    }

    // Para mim saber se "todos" os produtos foram encontrados
    const existsProdutsIds = existsProducts.map(product => product.id);

    // checar produtos inesistentes, comparando com o products que foi enviado
    const checkInexistentProducts = products.filter(
      // dos que foram enviados que não estiveram aqui(existsProdutsIds) vão estar na váriavel (checkInexistentProducts)
      product => !existsProdutsIds.includes(product.id),
    );

    // se tem algo nestá constante é porque tem produto que foi enviado que não existe
    if (checkInexistentProducts.length) {
      throw new AppError(
        // esse id que foi enviado não existe na aplicação, basta um para mim já cancelar o processo e devolver para o usuário
        `Could not find any product ${checkInexistentProducts[0].id}.`,
      );
    }

    // VERIFICAR QUANTIDADE
    /* Pegar cada um desses produtos e verificar se a quantidade está sendo enviada é suficiente ou sejá
      se existe quantidade suficiente no meu estoque para atender */
    const quantityAvailable = products.filter(
      // do array que foi enviado eu tô pegando cada produto e relacionando com o array do produtos que foram encontrados(confirmados)
      // o id do produto que foi enviado tem que ser igual ao id que eu garanti que existe no repositório no banco
      // se ele tiver com a quantidade menor que a quantidade que está sendo comprada pelo cliente eu tenho que impedir, não posso vender mais do que eu tenho
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    // não posso vender mais do que tenho no estoque
    if (quantityAvailable.length) {
      throw new AppError(
        `the quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}.`,
      );
    }

    // lista de produtos já montada
    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await ordersRepository.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    // mapear cada produto
    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        //ir no banco de dados, pegar a quantidade que está nele e diminuir pela quantidade que está sendo comprada
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await productsRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
