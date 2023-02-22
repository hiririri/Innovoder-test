import {
  Body,
  CacheInterceptor,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProductService } from "./product.service";
import Cache from 'cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller("/api/v1/product")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @UseGuards(AuthGuard("jwt"))
  @Get(":body")
  async getProduct(@Body() body) {
    const product = this.productService.getProductByBarcode(body.code);
    // await this.cacheManager.set(product.id, product);
    // const value = await this.cacheManager.get('key');

    return product;
  }
}
