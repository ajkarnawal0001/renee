// import { UseGuards } from "@nestjs/common";
// import { Args, Mutation, Resolver } from "@nestjs/graphql";
// import { JwtAuthGuard } from '../../../core/utility/guards/jwt-auth.guard';
// import { RolesGuard } from '../../auth/gaurd/role.guard';
// import { Role } from '../../../core/utility/decorator/role.decorator';
// import { ROLES } from "@constants";
// import { ProductEntity } from "./entity/product.entity";
// import { UploadProductResponse } from "./models/product-upload-response.model";
// import { UploadProductDto } from "./dto";
// import { ProductService } from "./product.service";

// @Resolver()
// export class ProductResolver {
//     constructor(
//         private readonly productService: ProductService,
//     ) {}

//     @Mutation(()=>UploadProductResponse)
//     @UseGuards(JwtAuthGuard, RolesGuard)
//     @Role(ROLES.ADMIN)
//     async uploadProduct(
//         @Args('input', { type: () => UploadProductDto })
//         data: UploadProductDto,
//     )
//     {
//         return this.productService.uploadProduct(data);
//     }

// }