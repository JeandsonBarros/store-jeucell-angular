import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class OrderedService {

  url = "http://localhost:8080/"

  constructor(
    private http: HttpClient,
    private token: TokenService,
    private router: Router
  ) { }


  getOrdered(): Observable<any> {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    return this.http.get<any>(this.url+"ordered/user/", { headers: header }).pipe(
      catchError(() => {
        return of()
      })
    )
  }

  findOrderedById(email: string, page: number): Observable<any> {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    return this.http.get<any>(this.url+"ordered/find/" + email + "/?page=" + page, { headers: header }).pipe(
      catchError(() => {
        return of()
      })
    )
  }

  getOrderedAll(page: number): Observable<any> {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    return this.http.get<any>(this.url+"ordered/all/?page=" + page, { headers: header }).pipe(
      catchError(() => {
        this.router.navigate([''])
        return of()
      })
    )
  }

  postOrdered(ordered: any): Observable<any> {
   
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    ordered.cardNumber = ordered.cardNumber.replaceAll(" ", "")
    
    return this.http.post<any>(this.url+"ordered/", ordered, { headers: header }).pipe(
      catchError(() => {

        return of()
      })
    )
  }

  putOrdered(id: number, status: string): Observable<any> {

    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    return this.http.put<any>(this.url+"ordered/" + id, status, { headers: header }).pipe(
      catchError(() => {

        return of()
      })
    )
  }

  deleteOrdered(id: number): Observable<any> {

    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    return this.http.delete(this.url+"ordered/" + id, { headers: header }).pipe(
      catchError(() => {

        return of()
      })
    )
  }


}
