import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';
import AppError from '@shared/errors/AppError';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    let product = this.ormRepository.create();
    product.name = name;
    product.price = price;
    product.quantity = quantity;
    product = await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({ where: { name } })
    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productList = await this.ormRepository.findByIds(products)
    if (productList.length !== products.length) {
      throw new AppError("Some Product Id is invalid")
    }
    return productList;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const ids = products.map(product => ({ id: product.id }));
    let productList = await this.findAllById(ids);
    productList = productList.map(product => {
      const findIndex = products.findIndex(item => item.id === product.id);
      product.quantity -= products[findIndex].quantity;
      if(product.quantity<0){
        throw new AppError("Quantity out os storage")
      }
      return product;
    })
    await this.ormRepository.save(productList)

    const productsResponse = productList.map(product => {
      const findIndex = products.findIndex(item => item.id === product.id);
      product.quantity = products[findIndex].quantity

      return product
    })

    return productsResponse;
  }
}

export default ProductsRepository;
