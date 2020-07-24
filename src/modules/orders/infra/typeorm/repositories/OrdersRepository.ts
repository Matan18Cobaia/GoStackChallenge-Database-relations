import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from "../entities/OrdersProducts";
import AppError from '@shared/errors/AppError';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;
  private orderProductsRepository: Repository<OrdersProducts>;

  constructor() {
    this.ormRepository = getRepository(Order);
    this.orderProductsRepository = getRepository(OrdersProducts);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    let order = this.ormRepository.create();
    order.customer_id = customer.id;
    order.customer = customer;
    order = await this.ormRepository.save(order);
    let ordersProducts = products.map(product => {
      const orderProduct = this.orderProductsRepository.create();
      orderProduct.product_id = product.product_id;
      orderProduct.price = product.price;
      orderProduct.quantity = product.quantity;
      orderProduct.order_id = order.id;
      return orderProduct;
    })
    ordersProducts = await this.orderProductsRepository.save(ordersProducts);
    order.order_products = ordersProducts;
    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id);
    if (!order) {
      throw new AppError("Order not found")
    }

    const orderProducts = await this.orderProductsRepository.find({ where: { order_id: order.id } })

    order.order_products = orderProducts
    return order;
  }
}

export default OrdersRepository;
