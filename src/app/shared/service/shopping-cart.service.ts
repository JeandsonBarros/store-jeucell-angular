import { UsersService } from 'src/app/shared/service/users.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { ProductOfCart } from '../model/ProductOfCart.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  url = "http://localhost:8080/"

  constructor(
    private router: Router,
    private http: HttpClient,
    private token: TokenService,
    private usersService: UsersService
    ) { }

    getShoshoppingCart(): Observable<ProductOfCart[]> {

      if (this.token.asToken()) {
        let header = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.token.getToken()
        });
  
        return this.http.get<ProductOfCart[]>(this.url+"cart/shoppingcart", { headers: header }).pipe(
          catchError(error => {
            if (error.status == 401 || error.status == 403)
              this.router.navigate(["/user/login"])
            return of();
          })
        )
      } else {
        return of();
      }
    }
  
    putShoshoppingCart(productOfCart: ProductOfCart): Observable<number> {
      if (this.token.asToken()) {
        let header = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.token.getToken(),
        });
  
  
        return this.http.put<number>(this.url+"cart/shoppingcart/"+productOfCart.id, productOfCart, { headers: header }).pipe(
          catchError(error => {
            if (error.status == 401 || error.status == 403)
              this.router.navigate(["/user/login"])
            this.usersService.showMessage("Entre para adicionar ao carrinho")
            return of();
          })
        )
      } else {
        this.usersService.showMessage("Entre para adicionar ao carrinho")
        this.router.navigate(["/user/login"])
        return of();
      }
    }

    postShoshoppingCart(productOfCart: ProductOfCart): Observable<number> {
      if (this.token.asToken()) {
        let header = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.token.getToken(),
        });
  
        return this.http.post<number>(this.url+"cart/shoppingcart/", productOfCart, { headers: header }).pipe(
          catchError(error => {
            if (error.status == 401 || error.status == 403)
              this.router.navigate(["/user/login"])
            this.usersService.showMessage("Entre para adicionar ao carrinho")
            return of();
          })
        )
      } else {
        this.usersService.showMessage("Entre para adicionar ao carrinho")
        this.router.navigate(["/user/login"])
        return of();
      }
    }

    deleteShoshoppingCart(id: number): Observable<number> {
      if (this.token.asToken()) {
        let header = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.token.getToken(),
        });
  
        return this.http.delete<number>(this.url+"cart/shoppingcart/"+id, { headers: header }).pipe(
          catchError(error => {
            if (error.status == 401 || error.status == 403)
              this.router.navigate(["/user/login"])
            return of();
          })
        )
      } else {
        this.usersService.showMessage("Entre para adicionar ao carrinho")
        this.router.navigate(["/user/login"])
        return of();
      }
    }



}
