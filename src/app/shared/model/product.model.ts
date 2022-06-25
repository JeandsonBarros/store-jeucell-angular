export interface Product{
    id?: number;
    name: string;
    price: number;
    category: string;
    description: string;
    status: string;
    quantity: number;
    imgUrl?: string;
    imgName?: string;
    starsQuantity?: number;
    evaluationQuantity?: number;
}