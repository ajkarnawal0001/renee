import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StockUpdateEntity } from './entities';
import { StockUpdateService } from './stock_update.service';

@Resolver(() => StockUpdateEntity)
export class StockUpdateResolver {
  constructor(private readonly stockUpdateService: StockUpdateService) {}
}
