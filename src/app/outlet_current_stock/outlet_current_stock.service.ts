import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutletCurrentStock } from './entity';

@Injectable()
export class OutletCurrentStockService {
  constructor(
    @InjectRepository(OutletCurrentStock)
    private outletCurrentStockService: Repository<OutletCurrentStock>,
  ) {}

  async save(outletCurrentStockInput) {
    return await Promise.all(
      outletCurrentStockInput.map(async (item) => {
        const savedStock = await this.outletCurrentStockService.save(item);
        if (!savedStock) {
          throw new HttpException(
            `This stock with id ${item.product_id} not saved`,
            HttpStatus.NOT_FOUND,
          );
        }
        return Promise.resolve(savedStock);
      }),
    );
  }

  async isCurrentStockExist(data) {
    const { productData, store_id, added_by } = data;
    const updatedCurrentStockData = await Promise.all(
      productData.map(async (product) => {
        const isStockExist = await this.outletCurrentStockService.findOne({
          where: { product_id: product.product_id, store_id },
        });
        if (!isStockExist) {
          const payload = {
            store_id,
            added_by,
            quantity: product.quantity,
            product_id: product.product_id,
          };
          const newStock = this.outletCurrentStockService.create(payload);
          return Promise.resolve(newStock);
        }
        const existingQuantity = +isStockExist.quantity;
        const totalQuantity = existingQuantity + Number(product.quantity);
        isStockExist.quantity = totalQuantity;
        return Promise.resolve(isStockExist);
      }),
    );
    return updatedCurrentStockData
  }

  async updateQuantity(
    storeId: string,
    productId: string,
    soldQuantity: number,
    type: string,
  ) {
    const store = await this.productAvailable(storeId, productId);
    const quantity: number = +store.quantity;
    let quantityLeft;
    if (type === 'sale') {
      quantityLeft = Number(quantity) - Number(soldQuantity);
    } else {
      quantityLeft = Number(quantity) + Number(soldQuantity);
    }
    store.quantity = quantityLeft;
    const updatedStore = await this.outletCurrentStockService.save(store);
    if (!updatedStore) {
      throw new HttpException(
        `This outlet current stock with store id ${storeId} has not updated the quantity`,
        HttpStatus.FORBIDDEN,
      );
    }
    return Promise.resolve(updatedStore)
  }

  async productAvailable(store_id: string, product_id: string) {
    const isStockExist = await this.outletCurrentStockService.findOne({
      where: { product_id, store_id },
    });
    if (!isStockExist) {
      throw new HttpException(
        `This stock with id ${product_id} is not available in store id ${store_id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return isStockExist;
  }
}
