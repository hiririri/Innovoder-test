import {
  Body,
  CacheInterceptor,
  CacheKey,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProductService } from "./product.service";

@UseInterceptors(CacheInterceptor)
@Controller("/api/v1/product")
export class ProductController {
  /**
   * @ignore
   */
  constructor(private readonly productService: ProductService) {}

  /**
   * A methode that fetches a food product from OpenFoodFacts API
   * @param body barcode of the product wanted
   * @returns product information
   */
  @CacheKey("custom_key")
  @UseGuards(AuthGuard("jwt"))
  @Get(":body")
  getProduct(@Body() body) {
    return this.productService.getProductByBarcode(body.code);
  }
}
