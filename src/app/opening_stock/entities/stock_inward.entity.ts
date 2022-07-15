import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../utility/entity';

@Entity('stock_inward')
export class StockInwardEntity extends BaseEntity {
  @Column('uuid')
  store_id: string;

  @Column('uuid')
  product_id: string;

  @Column('integer')
  quantity: number;

  @Column('uuid')
  added_by: string;

  @Column('uuid',{nullable:true})
  edited_by: string;
}