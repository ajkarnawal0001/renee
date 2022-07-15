import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSoldProductInput } from './dto/create_sold_product.dto';
import { SoldProduct } from './entity';

@Injectable()
export class SoldProductService {
  constructor(
    @InjectRepository(SoldProduct)
    private soldProductService: Repository<SoldProduct>
  ){}

  async create(createSoldProductInput:CreateSoldProductInput){
    const {sale_id,product_id,product_price,product_quantity,total_amount} = createSoldProductInput
    
    const createdSoldProduct = this.soldProductService.create(createSoldProductInput)
    
    if(!createdSoldProduct){
      throw new HttpException(
        `This sale with product_id ${product_id} is not completed with sale id${sale_id}`,
        HttpStatus.NOT_FOUND,
        );
      }
      const savedSoldProduct = await this.soldProductService.save(createdSoldProduct)
    return savedSoldProduct
  }

  async soldProductSave(data){
    const savedSoldProduct = await this.soldProductService.save(data)
    if(!savedSoldProduct){
      throw new HttpException(
        `This product in sold product data is not saved with product_id ${data.product_id} `,
        HttpStatus.NOT_FOUND,
        );
      }
      return savedSoldProduct
  }

  async productSold(data){
    const {sale_id,product_id} = data
    const isProductExist = await this.soldProductService.findOne({where:{
      sale_id,
      product_id
    }})
    if(!isProductExist){
      throw new HttpException(
        `This product with id ${product_id} is not found with sale id${sale_id}`,
        HttpStatus.NOT_FOUND,
        );
      }
      return isProductExist
  }

}
