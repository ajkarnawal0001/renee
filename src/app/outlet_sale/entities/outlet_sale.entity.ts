import { BaseEntity } from 'src/app/utility/entity';
import { Entity, Column } from 'typeorm';

@Entity('outlet_sale')
export class OutletSale extends BaseEntity{
  @Column('uuid')
  store: string;

  @Column('uuid')
  sold_by: string;

  @Column('date')
  date: string;

  @Column('text')
  sale_id:string;
}
