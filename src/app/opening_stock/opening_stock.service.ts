import {
  Injectable,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AddOpeningStockDto, StockReportDto, updateOpeningStock } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { StockUpdateService } from '../stock_update/stock_update.service';
import { OpeningStockEntity, StockInwardEntity } from './entities';
import { StoreService } from '../store/store.service';
import {
  AddOpeningStockResponse,
  opening_stock,
  stock_inward,
} from './interface';
import { OutletCurrentStockService } from '../outlet_current_stock/outlet_current_stock.service';
import { UtilityService } from '../utility';
@Injectable()
export class OpeningStockService {
  constructor(
    @InjectRepository(OpeningStockEntity)
    private openingStockService: Repository<OpeningStockEntity>,
    @InjectRepository(StockInwardEntity)
    private stockInwardService: Repository<StockInwardEntity>,
    private stockUpdateService: StockUpdateService,
    private storeService: StoreService,
    private outletCurrentStockService: OutletCurrentStockService,
    private utilityService: UtilityService,
  ) {}

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
      quantityLeft = quantity - soldQuantity;
    } else {
      quantityLeft = quantity + soldQuantity;
    }
    store.quantity = quantityLeft;
    const updatedStore = this.openingStockService.save(store);
    if (!updatedStore) {
      throw new HttpException(
        `This store with id ${storeId} has not updated the quantity`,
        HttpStatus.FORBIDDEN,
      );
    }
    return Promise.resolve(updatedStore);
  }

  async productAvailable(store_id: string, product_id: string) {
    const isStockExist = await this.openingStockService.findOne({
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

  async updateOpeningStock(data: updateOpeningStock) {
    const { store_id, productData, added_by, type } = data;
    const store = await this.storeService.findOne(store_id);

    const saveData = async (data) => {
      return await Promise.all(
        data.map(async (item) => {
          let savedStock;
          if (type === opening_stock) {
            savedStock = await this.openingStockService.save(item);
          } else if (type === stock_inward) {
            savedStock = await this.stockInwardService.save(item);
          }
          if (!savedStock) {
            throw new HttpException(
              `This stock with id ${item.product_id} not saved`,
              HttpStatus.NOT_FOUND,
            );
          }
          return Promise.resolve(savedStock);
        }),
      );
    };

    const addStockUpdate = async (data) => {
      const createdStockUpdate = await this.stockUpdateService.create(data);
      return Promise.resolve(createdStockUpdate);
    };

    const result = await Promise.all([
      await this.createNewAddStock({ productData, store_id, added_by, type }),
      await this.outletCurrentStockService.isCurrentStockExist({
        productData,
        store_id,
        added_by,
      }),
    ]).then(async (results) => {
      return Promise.all([
        await saveData(results[0]),
        await this.outletCurrentStockService.save(results[1]),
        type === opening_stock &&
          (await addStockUpdate({
            is_stock_updated: true,
            store_id: data.store_id,
            updated_by: data.added_by,
          })),
      ]).then((res) => {
        return Promise.resolve(res[0]);
      });
    });
    return result;
  }

  async createNewAddStock(data) {
    const { productData, store_id, added_by, type } = data;
    const updatedOpeningStockData = await Promise.all(
      productData.map(async (product) => {
        const payload = {
          store_id,
          quantity: product.quantity,
          edited_by: data.edited_by,
          added_by,
          product_id: product.product_id,
        };
        let newStock;
        if (type === opening_stock) {
          newStock = this.openingStockService.create(payload);
        } else if (type === stock_inward) {
          newStock = this.stockInwardService.create(payload);
        }
        return Promise.resolve(newStock);
      }),
    );
    return updatedOpeningStockData;
  }

  async findStockReport(data: StockReportDto) {
    
    const { month, year } = data;

    const allDates = this.getDate(+month, +year);

    const resonse = async (dates) => {
      let myObject = dates;
      for (var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
          myObject[key] = myObject[key].split(' ');
          let [startDate, endDate] = [myObject[key][0], myObject[key][1]];
          // startDate = new Date(startDate)
          // endDate = new Date(endDate)
          console.log(startDate, endDate);
           await this.getOpeningStockData(startDate,endDate)
        }
      }
    };

    const rangeDate = resonse(allDates);
  }

  async getOpeningStockData(startDate,endDate){
    console.log(startDate,endDate)
    const openingStockQueryResponse = await getRepository(OpeningStockEntity)
            .createQueryBuilder('opening_stock')
            .select('SUM(opening_stock.quantity)', 'opening_stock_quantity')
            .addSelect('SUM(opening_stock.product_id)', 'opening_stock_sku')
            .where(
              `opening_stock.created_at>=2022-07-12
                  opening_stock.created_at<=2022-07-12 `,
            )
            .execute()
            
            console.log(openingStockQueryResponse)
            return openingStockQueryResponse
  }

  getDate(month: number, year: number) {
    function DayOfMonth(year, month, day) {
      return new Date(year, month, day);
    }
    const firstDay = DayOfMonth(year, month, 1);

    let days;
    function mondaysInMonth(m, y) {
      days = new Date(y, m, 0).getDate();
      let monday = [2 - new Date(m + '/01/' + y).getDay()];
      for (let i = monday[0] + 7; i <= days; i += 7) {
        monday.push(i);
      }
      return monday;
    }
    let mondays = mondaysInMonth(month + 1, year);

    let array = [];
    if (firstDay.getDay() !== 0) {
      array.push(1);
    }
    for (let i = 0; i < mondays.length; i++) {
      if (mondays[i] > 1) {
        array.push(mondays[i]);
      }
      if (mondays[i] + 5 < days) {
        array.push(mondays[i] + 5);
      }
    }

    const lastDay = DayOfMonth(year, month, days);
    if (lastDay.getDay() !== 0) {
      array.push(days);
    }
    const allDates = array.map((date) => {
      date = date.toString();
      return `${year}-${month}-${date}`;
    });
    const weeks = {};
    for (let i = 0, j = 0; i < allDates.length; i++, j++) {
      const weekName = `week ${j + 1}`;
      weeks[weekName] = allDates[i] + ' ' + allDates[i + 1];
      i++;
    }
    return weeks;
  }
}
