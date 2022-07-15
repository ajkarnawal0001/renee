import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@ObjectType()
export class StoreModel {
  @Field()
  store_name: string;

  @Field()
  address: string;

  @Field()
  latitude: string;

  @Field()
  longitute: string;

  @Field()
  is_active: boolean;

  // @OneToMany(() => OpeningStock, (opening_stock) => opening_stock.)
  // @Field(()=> [OpeningStock],{nullable:true})
  // opening_stock: OpeningStock[]
}
