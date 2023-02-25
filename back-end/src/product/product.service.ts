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
  /**
   * @ignore
   */
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * A methode that fetches a food product from the OpenFoodFact API
   * @param code barcode given by user authorized
   * @returns a food product if the product exists with the corresponding barcode, else throw a NotFoundException.
   */
  async getProductByBarcode(code: string) {
    // get the product in cache
    const value = await this.cacheManager.get(code);
  
    // verify if the product exists already in cache system
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

      // put the product in cache system
      await this.cacheManager.set(code, response.data, 10000);

      return response.data;
    }

    return value;
  }
}
