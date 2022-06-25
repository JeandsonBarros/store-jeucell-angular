import { Product } from './../../shared/model/product.model';
import { ProductService } from 'src/app/shared/service/product.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  
  title = "";
  products!: Product[];
  search!: string;

  size!: number;
  totalElements!: number;
  totalPages!: number;
  progressBar = false
  

  constructor( private route: ActivatedRoute,
                private productService: ProductService
    ) { }

  ngOnInit(): void {
   
    this.search = ""
    this.route.params.subscribe(params => {
      this.search = params["name"]
      
        this.title = "Busca por " + this.search
        this.productService.getForName(this.search, 0).subscribe(products => {
          let dataTemp: any = products
         
          this.products = dataTemp.content;
          this.progressBar = true
          this.size = dataTemp.size
          this.totalElements = dataTemp.totalElements
          this.totalPages = dataTemp.totalPages
        })
      
    })
  
  }
  
  pageController(event: any) {
    let pageEvent: PageEvent = new PageEvent;
    pageEvent = event

      this.productService.getForName(this.search, pageEvent.pageIndex).subscribe(data => {
        let dataTemp: any = data
        this.products = dataTemp.content

        this.size = dataTemp.size
        this.totalElements = dataTemp.totalElements
        this.totalPages = dataTemp.totalPages
      })
    }
  

}
