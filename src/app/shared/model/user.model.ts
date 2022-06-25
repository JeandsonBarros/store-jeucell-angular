import { Product } from './product.model';
export interface UserShopping {
    name: string,
    birthDate: string,
    cpf: number,
    email: string,
    password: string,
    favoriteProducts?: Product[],
    shoppingCart?: Product[],
    requestsProducs?: Product[]

}