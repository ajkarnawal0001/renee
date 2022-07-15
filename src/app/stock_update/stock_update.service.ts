import { Injectable , HttpException, HttpStatus} from '@nestjs/common';
import { CreateStockUpdateInput } from './dto/create-stock_update.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockUpdateEntity } from './entities';

@Injectable()
export class StockUpdateService {
  constructor(
    @InjectRepository(StockUpdateEntity)
    private stockUpdateRepo:Repository<StockUpdateEntity>,
  ) {}

  async create(createStockUpdateInput: CreateStockUpdateInput) {
    const stockUpdate = await this.stockUpdateRepo.create(createStockUpdateInput)
    const updatedOpeningStock =  await this.stockUpdateRepo.save(stockUpdate);
    if(!updatedOpeningStock){
      throw new HttpException(`This stock of store id ${createStockUpdateInput.store_id} is not added or updated` , HttpStatus.BAD_REQUEST);
    }
    return updatedOpeningStock
  }
}
