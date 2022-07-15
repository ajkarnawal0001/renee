import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('product')
export class ProductEntity {
    @PrimaryColumn({ generated: 'uuid' })
    id: string;

    
}