import { ProductOfCart } from './../model/ProductOfCart.model';
import { TokenService } from './token.service';
import { Product } from './../model/product.model';
import { UserShopping } from './../model/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, empty, map, Observable, of, tap } from 'rxjs';
import { loga } from '../model/loga';



@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //https://www.djamware.com/post/5f8f99673b3daf2033c40cac/angular-10-tutorial-oauth2-login-and-refresh-token

  show = new EventEmitter<boolean>();
  url = "http://localhost:8080/"

  constructor(
    private matSnackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private token: TokenService

  ) { }


  showMessage(msg: string): void {

    this.matSnackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['white-snackbar']

    })

  }

  getForEmail(email: string, page: number): Observable<UserShopping[]> {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    return this.http.get<UserShopping[]>(this.url+'users/' + email + "?page=" + page + "&size=10", { headers: header }).pipe(
      catchError(() => {
        this.router.navigate([''])
        return of()
      })
    )
  }


  getUserAuthenticated(): Observable<UserShopping> {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    return this.http.get<UserShopping>(this.url+'users/authenticated', { headers: header }).pipe(
      catchError(() => {

        return of()
      })
    )
  }

  getFavorites(): Observable<Product[]> {

    if (this.token.asToken()) {
      let header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token.getToken()
      });

      return this.http.get<Product[]>(this.url+"users/favorites", { headers: header }).pipe(
        catchError(() => {
          return of()
        })
      );
    } else {
      return of();
    }
  }

  putFavorites(product: Product): Observable<boolean> {
    if (this.token.asToken()) {
      let header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token.getToken()
      });

      return this.http.put<boolean>(this.url+"users/favorites", product, { headers: header }).pipe(
        catchError(error => {
          if (error.status == 401 || error.status == 403)
            this.router.navigate(["/user/login"])
          this.showMessage("Entre para adicionar ao seus favoritos")
          return of();
        })
      );
    } else {
      this.showMessage("Entre para adicionar ao seus favoritos")
      this.router.navigate(["/user/login"])
      return of();
    }
  }


  get(page: number): Observable<UserShopping[]> {

    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    });

    return this.http.get<UserShopping[]>(this.url+"users/all/?page="+page, { headers: header }).pipe(
      catchError(error => {
        console.log(error.status)
        if (error.status == 401 || error.status == 403)
        this.router.navigate([''])
        return of();
      })
    );
  }

  post(userShopping: UserShopping): Observable<string> {

    let requestOptions: Object = {
      /* other options here */
      responseType: 'text'
    }

    return this.http.post<string>(this.url+"users/", userShopping, requestOptions).pipe(
      catchError(error => {
        console.log(error)
        return of();
      })
    )
  }

  put(userShopping: UserShopping): Observable<UserShopping> {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    });

    return this.http.put<UserShopping>(this.url+"users/"+userShopping.email, userShopping, { headers: header }).pipe(
      catchError(error => {
        
        if (error.status == 401 || error.status == 403){
          this.router.navigate([''])
        }

        else if(error.status == 400)
          this.showMessage("Erro ao editar")

        return of();
      })
    );
  }

  passwordChange(email: string, changePasswor: any):Observable<string>{
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    });

    let HTTPOptions:Object = {

      headers:header,
      responseType: 'text'
   }
  

    return this.http.put<string>(this.url+"users/changepasswor/"+email+"/", changePasswor, HTTPOptions).pipe(
      catchError(error=> {
        console.log(error);
        
        return of();
      })
    )
  }

  logar(userShopping: loga) {

    let requestOptions: Object = {
      /* other options here */
      responseType: 'text'
    }

    return this.http.post<any>(this.url+"login", {
      "email": userShopping.email,
      "password": userShopping.password
    }, requestOptions).pipe(
      catchError(error => {
        if (error.status == 401 || error.status == 403)
          this.showMessage("Erro ao logar, verifique se o e-mail ou senha estão corretos.")
        return of();
      })
    ).subscribe(res => {

      this.token.setToken("Bearer " + res)
      this.show.emit(true);
      this.router.navigate([""])
      
    })
  }

  delete(email: string): Observable<any> {

    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    });

    return this.http.delete<any>(this.url+"users/" + email, {headers: header}).pipe(
      catchError(error => {
        if (error.status == 401 || error.status == 403)
          this.router.navigate([""])
        return of();
      })
    )
  }

  logout() {
    this.token.deleteToken()
    this.show.emit(false);
    this.router.navigate(["/user/login"])

  }

  isAuth() {
    this.show.emit(this.token.asToken());
    return this.token.asToken();
  }

  sendEmail(email: string): Observable<any>{
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let HTTPOptions:Object = {
      headers: header,
      responseType: 'text',
      observe: 'response'
   }

    return this.http.post<any>(this.url+'users/send-email', email, HTTPOptions)
  }

  sendCode(code: number):Observable<any> {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let HTTPOptions:Object = {
      headers: header,
      responseType: 'text',
      observe: 'response'
   }
    return this.http.get<any>(this.url+'users/check-code/'+code, HTTPOptions)

  }

  sendNewPasswor(newPassword: Object) {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let HTTPOptions:Object = {
      headers: header,
      responseType: 'text',
      observe: 'response'
   }
    return this.http.put<any>(this.url+'users/forgotpassword/', newPassword, HTTPOptions)

  }

  

}
