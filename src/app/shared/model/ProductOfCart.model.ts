import { Product } from './product.model';
import { UserShopping } from './user.model';

export interface ProductOfCart{
  id?: number,
  user?: UserShopping,
  product: Product,
  quantity: number,
  total?: number
}