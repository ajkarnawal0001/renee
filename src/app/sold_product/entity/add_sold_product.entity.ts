import { BaseEntity } from 'src/app/utility/entity';
import { Entity, Column } from 'typeorm';

@Entity('sold_product')
export class SoldProduct extends BaseEntity{
  @Column('text')
  sale_id: string;

  @Column('uuid')
  product_id: string;

  @Column('integer')
  product_quantity:number;

  @Column('integer')
  product_price:number;

  @Column('integer')
  total_amount:number;
}
