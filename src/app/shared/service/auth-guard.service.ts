import { UsersService } from 'src/app/shared/service/users.service';
import { TokenService } from './token.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private tokenService: TokenService,
    private route: Router,
    private usersService: UsersService
  ) { }

  //https://codecraft.tv/courses/angular/routing/router-guards/

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    if (this.tokenService.asToken()) {
      return true;
    } else {
      this.route.navigate(['/user/login'])
      switch (state.url) {
        case "/cart":
          this.usersService.showMessage("Entre ou cadastre-se para comprar.");
          break;
        case "/user/data":
          this.usersService.showMessage("Entre ou cadastre-se para ver seus dados.");
          break;
        case "/user/requests":
          this.usersService.showMessage("Entre ou cadastre-se para ver seus pedidos.");
          break;
      }

      return false;
    }

  }
}
