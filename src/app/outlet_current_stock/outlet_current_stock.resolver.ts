import { Resolver } from '@nestjs/graphql';
import { OutletCurrentStockService } from './outlet_current_stock.service';

@Resolver()
export class OutletCurrentStockResolver {
  constructor(private readonly outletCurrentStockService: OutletCurrentStockService) {}
}
