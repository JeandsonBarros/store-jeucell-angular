import { Evaluation } from './../../shared/model/evaluation';
import { ProductService } from 'src/app/shared/service/product.service';
import { Product } from 'src/app/shared/model/product.model';
import { OrderedService } from './../../shared/service/ordered.service';
import { UsersService } from 'src/app/shared/service/users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ordered-products',
  templateUrl: './ordered-products.component.html',
  styleUrls: ['./ordered-products.component.scss']
})
export class OrderedProductsComponent implements OnInit {
  panelOpenState = false;
  ordereds: any;
  color = "primary"
  subTitle!: string;
  progressBar = false
  

  constructor(private orderedService: OrderedService) { }


  ngOnInit(): void {

    this.orderedService.getOrdered().subscribe(ordereds => {
      this.ordereds = ordereds
      this.progressBar = true
      this.subTitle = this.ordereds.length == 0 ? "Sem pedidos" : "";

    })
  }
 

  orderedStatus(status: string): number {
    switch (status) {
      case 'Em análise':
        return 0;
      case 'Aprovado':
        return 10;
      case 'A caminho':
        return 50;
      case 'Entregue':
        return 100;
      case 'Pagamento recusado':
        return 100;
      case 'Produto indisponível':
        return 100;
      default:
        return 0;
    }

  }



}
