import { UsersService } from './../../shared/service/users.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/model/product.model';
import { Router, RouterEvent } from '@angular/router';
import { ProductService } from 'src/app/shared/service/product.service';
import { filter, of } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent implements OnInit {

  visible = false;
  favotiresTitle = ""
  openAndClose = "search";
  search = ""
  products!: Product[]

  constructor(private userService: UsersService,
    private route: Router,
    private productService: ProductService
  ) { }

  asUser = true;

  ngOnInit(): void {

    this.route.events.subscribe(data => {
      let url: any = data
      if (url.url != undefined) {

        if (url.url == "/user/login"  ||  url.url == "/user/register" ||  url.url == "/user/change-password")
          this.asUser = false
        else if (url.url != "/user/login" && url.url != "/user/register" ||  url.url != "/user/change-password")
          this.asUser = true
      
      }
    })
  }

  fastSearch() {
    if (this.search) {
      this.productService.getAutoComplete(this.search).subscribe(data => this.products = data)
    } else {
      this.products = []
    }
  }

  searchForName() {
    this.visible = false;
    this.openAndClose = "search";

    if (this.search) {
      this.route.navigate(["/busca/" + this.search])
    } else {
      this.route.navigate(["/"])

    }
  }

  searchVisible() {
    this.visible = !this.visible;
    this.openAndClose = this.visible ? "close" : "search";
  }

  getFvorites() {
    this.products = []
    this.favotiresTitle = "Entre para ver seus favoritos"

    this.userService.getFavorites().subscribe(resp => {
      if (resp.length == 0) {
        this.favotiresTitle = "Favoritos vazio!"
      }
      else {
        this.favotiresTitle = "Seus favoritos"
        this.products = resp
      }
    })

  }


}
