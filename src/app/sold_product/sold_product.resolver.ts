import { Resolver } from '@nestjs/graphql';
import { SoldProductService } from './sold_product.service';

@Resolver()
export class SoldProductResolver {
  constructor(private readonly soldProductService: SoldProductService) {}
}
