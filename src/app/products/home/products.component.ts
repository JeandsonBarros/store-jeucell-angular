import { Product } from './../../shared/model/product.model';
import { Component, HostListener, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/service/product.service';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {


  /* size = window.innerWidth;
  @HostListener('window:resize', ['$event'])

  onResize() {
  this.size = window.innerWidth; 
} */
  products : any
  categorys: any = []
  progressBar = false
  
  constructor(
    private service: ProductService,
    public dialog: MatDialog,
    ) {

  }

  ngOnInit(): void {
    this.service.getForHome().subscribe(products => {
      this.products = products
      this.progressBar = true
      this.categorys = Object.keys(products)
    })

  }

}
