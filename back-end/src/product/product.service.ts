import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

@Injectable()
export class ProductService {
  constructor(private readonly httpService: HttpService) {}

  async getProductByBarcode(code: string) {
    const url = `https://world.openfoodfacts.org/api/v2/product/${code}`;

    const response = await axios({
      method: 'GET',
      url: `${url}`,
    }).catch(() => {
      throw new ForbiddenException('API not available');
    });

    if (!response.data?.product) {
      throw new NotFoundException(`Product ${code} doesn't exist.`);
    }

    return {
      product: response.data?.product,
    };
  }
}
