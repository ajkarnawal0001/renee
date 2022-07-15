import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../utility/entity';

@Entity('store')
export class StoreEntity extends BaseEntity {
  @Column('text')
  store_name: string;

  @Column('text')
  address: string;

  @Column('text')
  latitude: string;

  @Column('text')
  longitude: string;

  @Column('boolean')
  is_active: boolean;

}