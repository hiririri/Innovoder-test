import {
  Body,
  CacheInterceptor,
  CacheKey,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProductService } from "./product.service";

@UseInterceptors(CacheInterceptor)
@Controller("/api/v1/product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @CacheKey("custom_key")
  @UseGuards(AuthGuard("jwt"))
  @Get(":body")
  getProduct(@Body() body) {
    return this.productService.getProductByBarcode(body.code);
  }
}
