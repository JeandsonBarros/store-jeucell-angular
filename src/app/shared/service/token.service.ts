import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }


  setToken(toke: string) {
    localStorage.setItem("token", toke)
  }

  getToken(): any {
    let token: any = localStorage.getItem("token")? localStorage.getItem("token") : "not-as-token"
    return token
  }

  deleteToken(){
    localStorage.removeItem("token")
  }

  asToken(){
    let token = localStorage.getItem("token")
    return token? true : false
  }

}
