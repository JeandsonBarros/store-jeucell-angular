import { Observable } from 'rxjs';
import { ProductService } from './../../shared/service/product.service';
import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Product } from 'src/app/shared/model/product.model';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'adm-app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductsComponent implements OnInit {
 
  columnsToDisplay = ['id', 'name', 'price',  'options'];
  expandedElement!: Product;

  selected = "Todos";
  products!: Product[];

  search = "";

  size!: number;
  totalElements!: number;
  totalPages!: number;

  a = ""

  constructor(public dialog: MatDialog, private productService: ProductService) { }

  progress: Observable<number> =  this.productService.progress;

  ngOnInit(): void {
    
    this.productService.get(0).subscribe(products => {
     
      let dataTemp: any = products
      this.products = dataTemp.content;

      this.size = dataTemp.size
      this.totalElements = dataTemp.totalElements
      this.totalPages = dataTemp.totalPages

    })

  }

  pageController(event: any) {
    let pageEvent: PageEvent = new PageEvent;
    pageEvent = event

    if (this.selected == "Todos") {
      this.productService.get(pageEvent.pageIndex).subscribe(products => {
        let dataTemp: any = products
        this.products = dataTemp.content;
      })
    } else if(this.selected != "Todos"){
      this.productService.getCategory(this.selected, pageEvent.pageIndex).subscribe(data => {
        let dataTemp: any = data
        this.products = dataTemp.content
      })
    }else if(this.search != ""){
      this.productService.getForName(this.search,  pageEvent.pageIndex).subscribe(products => {
        let dataTemp: any = products
        this.products = dataTemp.content; 
      })
    }
  }

  searchProduct(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.selected = "Todos"

    if (filterValue == "") {
      this.productService.get(0).subscribe(products => {
        let dataTemp: any = products
        this.products = dataTemp.content;

        this.size = dataTemp.size
        this.totalElements = dataTemp.totalElements
        this.totalPages = dataTemp.totalPages
      })
    }
    else {
      this.productService.getForName(filterValue, 0).subscribe(products => {
        let dataTemp: any = products
        this.products = dataTemp.content;

        this.size = dataTemp.size
        this.totalElements = dataTemp.totalElements
        this.totalPages = dataTemp.totalPages
      
      })
    }
  }

  openDialog(product: Product): void {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '18rem',
      data: product,

    });

    dialogRef.afterClosed().subscribe(() => {

    });
  }

  categorye() {
    if (this.selected == "Todos") {
      this.ngOnInit();
    }
    else {
      this.productService.getCategory(this.selected, 0).subscribe(data => {
        let dataTemp: any = data
        this.products = dataTemp.content

        this.size = dataTemp.size
        this.totalElements = dataTemp.totalElements
        this.totalPages = dataTemp.totalPages
      })
    }
  }



  delete(product: any): void {
    this.productService.delete(product).subscribe(() => {
      
      this.ngOnInit()
      //window.location.reload();
    });

  }

}


