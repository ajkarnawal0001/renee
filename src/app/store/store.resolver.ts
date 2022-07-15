import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StoreEntity } from './entity';
import { StoreModel } from './models';
import { StoreService } from './store.service';
@Resolver()
export class StoreResolver {
  constructor(private readonly storeService: StoreService) {}


  // @Query(() => [StoreEntity], { name: 'store' })
  // findAll() {
  //   return this.storeService.findAll();
  // }

  @Query(() => StoreModel, { name: 'store' })
  findOne(@Args('id') id: string) {
    return this.storeService.findOne(id);
  }

  // @Mutation(() => StoreEntity)
  // updateStore(@Args('updateStoreInput') updateStoreInput: UpdateStoreInput) {
  //   return this.storeService.update(updateStoreInput.id, updateStoreInput);
  // }

  // @Mutation(() => StoreEntity)
  // removeStore(@Args('id', { type: () => Int }) id: number) {
  //   return this.storeService.remove(id);
  // }
}
