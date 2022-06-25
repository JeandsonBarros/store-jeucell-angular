import { Router } from '@angular/router';
import { catchError, finalize, map, Observable, of } from 'rxjs';
import { Product } from './../model/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { async } from '@firebase/util';
import { TokenService } from './token.service';


@Injectable({
  providedIn: 'root'
})

export class ProductService {


  url = "http://localhost:8080/"

  constructor(
    private matSnackBar: MatSnackBar,
    private http: HttpClient,
    private storage: AngularFireStorage,
    private token: TokenService,
    private route: Router
  ) { }

  showMessage(msg: string): void {

    this.matSnackBar.open(msg, 'X', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['white-snackbar']

    })

  }

  progress = new EventEmitter<number>()

  get(page: number): Observable<Product[]> {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    return this.http.get<Product[]>(this.url+"products/all/?size=10&page=" + page, { headers: header }).pipe(
      catchError(error => {
        this.route.navigate([''])
        return of()
      })
    )
  }

  getAutoComplete(search: any): Observable<Product[]> {
    return this.http.get<Product[]>(this.url+"products/fast/" + search)
  }

  getForHome(): Observable<any> {
    return this.http.get<any>(this.url+"products/home")
  }

  getCategory(category: any, page: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.url+"products/category/" + category + "/?page=" + page + "&size=10")
  }

  getForName(search: any, page: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.url+"products/" + "search/" + search + "/?page=" + page)
  }

  getForId(id: any): Observable<Product> {
    return this.http.get<Product>(this.url+"products/" + id)
  }

  post(product: Product): Observable<Product> {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    return this.http.post<Product>(this.url+"products/", product, { headers: header }).pipe(
      catchError(error => {
        let fileRef = this.storage.refFromURL("gs://loja-c7841.appspot.com/" + product.imgName);
        fileRef.delete()
        this.route.navigate([''])
        return of()
      })
    )
  }

  up(product: Product, file: File) {
    let downloadURL: Observable<string>;

    const filePath = file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.percentageChanges().subscribe(data => {
      this.progress.emit(data);
      
    })

    task.snapshotChanges().pipe(
      finalize(() => {
        downloadURL = fileRef.getDownloadURL()
        downloadURL.subscribe(data => {
          product = ({ imgUrl: data, imgName: filePath, ...(product) })
          this.post(product).subscribe(() => window.location.reload())
        })
      })
    ).subscribe()
  }


  delete(product: Product): Observable<any> {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    return this.http.delete<any>(this.url+"products/" + product.id, { observe: 'response', headers: header }).pipe(
      map(val => {  
        if(val){
          let fileRef = this.storage.refFromURL("gs://loja-c7841.appspot.com/" + product.imgName);
          fileRef.delete()      
        }
       
      }),
      catchError(error => {
        this.route.navigate([''])
        return of()
      })
    )
  }

  put(product: Product): Observable<Product> {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    return this.http.put<Product>(this.url+"products/" + product.id, product, { headers: header }).pipe(

      map(val => {  
        console.log(val)
       return val
      }),

      catchError(error => {

        this.route.navigate([''])
        return of()
      })
    )
  }

  upPut(product: Product, file: File) {

    if (file != undefined) {

      let fileRef = this.storage.refFromURL("gs://loja-c7841.appspot.com/" + product.imgName);
      fileRef.delete()
      let downloadURL: Observable<string>;
      let filePath = file.name;
      fileRef = this.storage.ref(filePath);
      let task = this.storage.upload(filePath, file);

      task.percentageChanges().subscribe(data => {
        this.progress.emit(data);
      })

      task.snapshotChanges().pipe(
        finalize(() => {
          downloadURL = fileRef.getDownloadURL()
          downloadURL.subscribe(data => {
            product.imgUrl = data
            product.imgName = filePath

            this.put(product).subscribe(() => {
              window.location.reload()
              this.showMessage("Produto editado")
            })
          })
        })
      ).subscribe()

    }
    else {
      this.put(product).subscribe(() => window.location.reload())
    }
  }

  evaluationProduct(evaluation: any):Observable<any>{
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    let HTTPOptions: Object = {
     headers: header,
     responseType: 'text',
     observe: 'response'
    }

    return this.http.post<any>(this.url+'products/evaluation/', evaluation, HTTPOptions);
  }

  editEvaluationProduct(evaluation: any):Observable<any>{
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    let HTTPOptions: Object = {
     headers: header,
     responseType: 'text',
     observe: 'response'
    }

    return this.http.put<any>(this.url+'products/evaluation/', evaluation, HTTPOptions);
  }

  deleteEvaluationProduct(id: number):Observable<any>{
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    let HTTPOptions: Object = {
     headers: header,
     responseType: 'text',
     observe: 'response'
    }

    return this.http.delete<any>(this.url+'products/evaluation/byusers/'+id, HTTPOptions);
  }
  
  getEvaluationsByUser():Observable<any>{
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token.getToken()
    })

    let HTTPOptions: Object = {
     headers: header,
     observe: 'response'
    }

    return this.http.get(this.url+'products/evaluation/byusers/', HTTPOptions)
  }

}
