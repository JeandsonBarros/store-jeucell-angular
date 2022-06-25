import { Product } from './../../shared/model/product.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

@Input() product!: Product;  

  constructor() { }

  ngOnInit(): void {
  }

}
