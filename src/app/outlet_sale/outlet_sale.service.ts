import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { OpeningStockService } from '../opening_stock/opening_stock.service';
import { StoreService } from '../store/store.service';
import { CreateOutletSaleInput } from './dto/create_outlet_sale.input';
import { ProductDetail } from './dto/product_details.dto';
import { AddOutletSaleInput } from './dto/update_outlet_sale.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutletReturnEntity, OutletSale } from './entities';
import { SoldProductService } from '../sold_product/sold_product.service';
import { OutletCurrentStockService } from '../outlet_current_stock/outlet_current_stock.service';
import { CreateOutletreturnsInput, ReturnProductDetailDto } from './dto';

@Injectable()
export class OutletSaleService {
  constructor(
    @InjectRepository(OutletSale)
    private outletSaleService: Repository<OutletSale>,
    @InjectRepository(OutletReturnEntity)
    private outletSaleReturnService: Repository<OutletReturnEntity>,
    private openingStockService: OpeningStockService,
    private storeService: StoreService,
    private soldProductService: SoldProductService,
    private outletCurrentStockService: OutletCurrentStockService,
  ) {}

  async create(createOutletSaleInput: CreateOutletSaleInput) {
    const { store, sold_by, product_detail, date, sale_id } =
      createOutletSaleInput;
    const isStore = await this.storeService.findOne(store);
    if (!isStore) {
      throw new HttpException(
        `store not found with this id ${store} `,
        HttpStatus.NOT_FOUND,
      );
    }

    const productAvailable = async (detail: ProductDetail) => {
      const isAvailable = await this.outletCurrentStockService.productAvailable(
        store,
        detail.sold_item,
      );
      if (!isAvailable) {
        throw new HttpException(
          `This stock with product_id ${detail.sold_item} is not available in store id ${store}`,
          HttpStatus.NOT_FOUND,
        );
      }
      if (detail.quantity > +isAvailable.quantity) {
        throw new Error(
          `This stock with product_id ${detail.sold_item} is not enough in a store id ${store}`,
        );
      }
        else if(detail.quantity <=0){
          throw new Error(
            `quantity should be more than 0`,
          );
      }
      const createSoldProductPayload = {
        sale_id,
        product_id: detail.sold_item,
        product_quantity: detail.quantity,
        product_price: detail.price,
        total_amount: Number(detail.price) * Number(detail.quantity),
      };
      return Promise.resolve(createSoldProductPayload);
    };

    const createSoldProduct = async (data) => {
      const createdSoldProduct = Promise.all(
        await data.map(async (soldProduct) => {
          return this.soldProductService.create(soldProduct);
        }),
      );
      return createdSoldProduct;
    };

    const updateOpeningStock = async (data) => {
      const updatedOpeningStock = Promise.all(
        await data.map(async (quantityDetail) => {
          return this.outletCurrentStockService.updateQuantity(
            store,
            quantityDetail.product_id,
            quantityDetail.product_quantity,
            'sale',
          );
        }),
      );
      return updatedOpeningStock;
    };

    const createdOutletSale = await Promise.all(
      product_detail.map((detail) => {
        return productAvailable(detail);
      }),
    ).then(async (soldProductPayload) => {
      return Promise.all([
        await this.createOutlet({ sale_id, date, sold_by, store }),
        await createSoldProduct(soldProductPayload),
        await updateOpeningStock(soldProductPayload),
      ]).then((results) => {
        return results[1];
      });
    });
    return createdOutletSale;
  }

  async createOutlet(data: AddOutletSaleInput) {
    const outletSale = this.outletSaleService.create(data);
    const createdOutletSale = await this.outletSaleService.save(outletSale);
    if (!createdOutletSale) {
      throw new HttpException(
        `Outlet sale not created`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return Promise.resolve(createdOutletSale);
  }

  async isSaleExist(sale_id: string) {
    const isExistSale = await this.outletSaleService.findOne({
      where: {
        sale_id,
      },
    });
    if (!isExistSale) {
      throw new Error(`There is no sale found with sale id ${sale_id}`);
    }
    return isExistSale;
  }

  async returnStock(CreateOutletreturnsInput: CreateOutletreturnsInput) {
    const { sale_id, product_detail, reason } = CreateOutletreturnsInput;
    const saleExist = await this.isSaleExist(sale_id);

    const isProductSold = async (data) => {
      const { product_detail, sale_id } = data;

      const isProductSoldExist = Promise.all(
        await product_detail.map(async (item: ReturnProductDetailDto) => {
          const { product_id, quantity } = item;
          const product = await this.soldProductService.productSold({
            product_id,
            sale_id,
          });
          if (product && product.product_quantity < quantity) {
            throw new HttpException(
              `this product with id ${product.product_id} can be return upto ${product.product_quantity} quantity.`,
              HttpStatus.BAD_REQUEST,
            );
          }
          else if(quantity <=0){
            throw new Error(
              `quantity should be more than 0`,
            );
          }
          const newQuantity = product.product_quantity - quantity;
          const newAmount = product.product_price * newQuantity;
          product.product_quantity = newQuantity;
          product.total_amount = newAmount;
          return product;
        }),
      );
      return isProductSoldExist;
    };

    const createReturnSale = async (newUpdateSaleData) => {
      const updateReturnSale = await Promise.all(
        await newUpdateSaleData.map(async (item: ReturnProductDetailDto) => {
          const { quantity } = item;
          const payload = {
            sale_id,
            product_quantity: quantity,
            reason,
          };
          return await this.createOutletReturn(payload);
        }),
      );
      return updateReturnSale;
    };

    const saveProductSoldQuantity = async (data) => {
      const [newProductSoldData] = data;
      const saveSoldProduct = await Promise.all(
        await newProductSoldData.map(async (item) => {
          return await this.soldProductService.soldProductSave(item);
        }),
      );
      return saveSoldProduct;
    };

    const updateOpeningStock = async (data) => {
      const [newCurrentStockData] = data;
      const updatedOpeningStock = await Promise.all(
        await newCurrentStockData.map(async (quantityDetail, i) => {
          return await this.outletCurrentStockService.updateQuantity(
            saleExist.store,
            quantityDetail.product_id,
            product_detail[i].quantity,
            'return',
          );
        }),
      );
      return updatedOpeningStock;
    };
    const updateReturnStock = await Promise.all([
      await isProductSold({ sale_id, product_detail }),
    ]).then(async (soldProductData) => {
      return Promise.all([
        await saveProductSoldQuantity(soldProductData),
        await updateOpeningStock(soldProductData),
        await createReturnSale(product_detail),
      ]).then((outletReturnData) => {
        return outletReturnData[2]
      });
    });
    return updateReturnStock
  }

  async createOutletReturn(outletSaleReturninput) {
    const outletSaleReturn = this.outletSaleReturnService.create(
      outletSaleReturninput,
    );
    if (!outletSaleReturn) {
      throw new HttpException(
        `Outlet return sale not created`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = await this.outletSaleReturnService.save(outletSaleReturn);
    return data;
  }
}
