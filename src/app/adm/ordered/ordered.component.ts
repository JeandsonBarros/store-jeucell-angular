import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OrderedService } from 'src/app/shared/service/ordered.service';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-ordered',
  templateUrl: './ordered.component.html',
  styleUrls: ['./ordered.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderedComponent implements OnInit {
 
  columnsToDisplay = ['id', 'nameUser', 'email', 'date', 'status', 'option'];
  expandedElement!: any;
  ordereds: any;
  color = "primary";

  idSerch = "";

  size!: number;
  totalElements!: number;
  totalPages!: number;

  constructor(private orderedService: OrderedService) { }

  ngOnInit(): void {

    this.orderedService.getOrderedAll(0).subscribe(ordereds => {
      let dataTemp: any = ordereds
      this.ordereds = dataTemp.content;
     
      this.size = dataTemp.size
      this.totalElements = dataTemp.totalElements
      this.totalPages = dataTemp.totalPages

    })
  }

  pageController(event: any) {
    let pageEvent: PageEvent = new PageEvent;
    pageEvent = event

    if (this.idSerch == "") {
      this.orderedService.getOrderedAll(pageEvent.pageIndex).subscribe(ordereds => {
        let dataTemp: any = ordereds
        this.ordereds = dataTemp.content;

      })
    } else {
      this.orderedService.findOrderedById(this.idSerch, pageEvent.pageIndex).subscribe(ordereds => {
        let dataTemp: any = ordereds
        this.ordereds = dataTemp.content;

      })
    }
  }

  searchProduct() {
    if (this.idSerch != "") {
      this.orderedService.findOrderedById(this.idSerch, 0).subscribe(ordereds => {
        let dataTemp: any = ordereds
        this.ordereds = dataTemp.content;
      
        this.size = dataTemp.size
        this.totalElements = dataTemp.totalElements
        this.totalPages = dataTemp.totalPages

      })
    }
    else {
      this.ngOnInit()
    }

  }



  statusAlter(id: number, status: any) {

    this.orderedService.putOrdered(id, status).subscribe()
  }

  deleteOrdered(id: number) {
    this.orderedService.deleteOrdered(id).subscribe(() => {
      this.ngOnInit()
    })
  }

}

