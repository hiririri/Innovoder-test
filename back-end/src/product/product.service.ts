import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import axios from "axios";
import { Cache } from "cache-manager";

@Injectable()
export class ProductService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getProductByBarcode(code: string) {
    const value = await this.cacheManager.get(code);

    if (!value) {
      const response = await axios({
        method: "GET",
        url: `https://world.openfoodfacts.org/api/v2/product/${code}`,
      }).catch(() => {
        throw new ForbiddenException("API not available");
      });
  
      if (!response.data?.product) {
        throw new NotFoundException(`Product ${code} doesn't exist.`);
      }

      await this.cacheManager.set(code, response.data, 10000);

      return response.data;
    }

    return value;
  }
}
