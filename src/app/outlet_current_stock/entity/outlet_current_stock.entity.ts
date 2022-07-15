import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../utility/entity';

@Entity('outlet_current_stock')
export class OutletCurrentStock extends BaseEntity {
  @Column('uuid')
  store_id: string;

  @Column('uuid')
  product_id: string;

  @Column('integer')
  quantity: number;

  @Column('uuid')
  added_by: string;
}