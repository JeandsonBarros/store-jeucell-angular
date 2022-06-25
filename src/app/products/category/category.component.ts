import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/model/product.model';
import { ProductService } from 'src/app/shared/service/product.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  
  category: any;

  products: Product[] = []
  title!: any
  displayedColumns: string[] = ['name', 'price', 'category', 'description', 'options'];

  size!: number;
  totalElements!: number;
  totalPages!: number;
  progressBar = false

  constructor(private service: ProductService, private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    
    this.route.params.subscribe(param => {
      this.category = param['category'];

      this.title = this.category.replaceAll("-", " ")
      this.service.getCategory(this.category, 0).subscribe(products => {
        let dataTemp: any = products
        this.products = dataTemp.content;
        this.progressBar = true
        this.size = dataTemp.size
        this.totalElements = dataTemp.totalElements
        this.totalPages = dataTemp.totalPages



      })
    })
    //const category = this.route.snapshot.paramMap.get('category');

  }
  pageController(event: any) {
    let pageEvent: PageEvent = new PageEvent;
    pageEvent = event

      this.service.getCategory(this.category, pageEvent.pageIndex).subscribe(data => {
        let dataTemp: any = data
        this.products = dataTemp.content
      })
    }
  }
  



