import { BaseEntity } from 'src/app/utility/entity';
import { Entity, Column } from 'typeorm';

@Entity('outlet_sale_returns')
export class OutletReturnEntity extends BaseEntity{
  @Column('text')
  sale_id: string;

  @Column('uuid')
  product_quantity: string;

  @Column('text',{nullable:true})
  reason:string;
}
