import { Injectable , Inject, forwardRef,HttpException,HttpStatus} from '@nestjs/common';
import { ResetPasswordDto } from '../auth/password/dto';
import { UserEntity } from '../user/entities';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddOpeningStockDto } from '../opening_stock/dto';
import { StoreEntity } from './entity';
import { OpeningStockService } from '../opening_stock/opening_stock.service';
@Injectable()
export class StoreService {

  constructor(
    @InjectRepository(StoreEntity) private storeRepo: Repository<StoreEntity>,
    @Inject(forwardRef(() => OpeningStockService))
    private openingStockService: OpeningStockService,
  ) {}
  // create(createStoreInput: CreateStoreInput) {
  //   return 'This action adds a new store';
  // }

  // findAll() {
  //   return `This action returns all store`;
  // }

  async findOne(id: string) {
    const store =  await this.storeRepo.findOneBy({id})
    if(!store){
      throw new HttpException(`store not found with this id ${id} `, HttpStatus.NOT_FOUND);
    }
    return store
   }

  // async updateOpeningStock(data: AddOpeningStockDto) {
  //   const store = await this.storeRepo.find(data.store_id)
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} store`;
  // }
}
