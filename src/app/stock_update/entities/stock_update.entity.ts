import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../utility/entity';

@Entity('stock_update')
export class StockUpdateEntity extends BaseEntity {
  @Column('boolean')
  is_stock_updated: boolean;

  @Column('uuid')
  store_id: string;

  @Column('text')
  updated_by: string;
}