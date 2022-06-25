import { UserShopping } from './../../shared/model/user.model';
import { UsersService } from './../../shared/service/users.service';
import { TokenService } from './../../shared/service/token.service';
import { Product } from './../../shared/model/product.model';


import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRoute, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { ProductService } from 'src/app/shared/service/product.service';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})
export class HeaderComponent implements OnInit {

  //https://medium.com/@ahsanalisiddique878/angular-10-crud-with-firebase-realtime-database-6ad8ba9eb5f5


  user!: UserShopping;

  search!: string;
  products!: Product[];

  asUser = false;
  menuIcon = false;
  isAlert = true;

  constructor(private userService: UsersService,
    private route: Router,
    private productService: ProductService
   

  ) { }

  ngOnInit(): void {
    this.menuIcon = this.asUser = this.userService.isAuth()

    if(this.asUser){
      this.userService.getUserAuthenticated().subscribe(user => this.user = user)
    }
    
    this.userService.show.subscribe(isShow => {
      this.menuIcon = isShow
    })

    
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
    if (this.search) {
      this.route.navigate(["/busca/" + this.search])
    } else {
      this.userService.showMessage("Campo de busca vazio")
    }
  }

  auth() {
    this.userService.logout()
  }




}
