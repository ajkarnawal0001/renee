import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AddStockModel } from './models';
import { OpeningStockService } from './opening_stock.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@utility';
import { StockReportDto, updateOpeningStock } from './dto';

@Resolver()
export class OpeningStockResolver {
  constructor(private readonly openingStockService: OpeningStockService) {}

  @Mutation(() =>[AddStockModel])
  @UseGuards(JwtAuthGuard)
  async addStocks(
    @Args('input', { type: () => updateOpeningStock })
    data: updateOpeningStock,
  ) {
    return this.openingStockService.updateOpeningStock(data);
  }


  @Query(() =>[AddStockModel])
  @UseGuards(JwtAuthGuard)
  async weeklyReport(
    @Args('input', { type: () => StockReportDto })
    data: StockReportDto,
  ) {
    return this.openingStockService.findStockReport(data);
  }
}

