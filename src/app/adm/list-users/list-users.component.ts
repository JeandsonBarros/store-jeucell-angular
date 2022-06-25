import { UsersService } from './../../shared/service/users.service';
import { UserShopping } from './../../shared/model/user.model';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  title = "Lista de usuários"
  users: UserShopping[] = []
  displayedColumns: string[] = ['name', 'email', 'cpf', 'options'];

  emailFind = "";

  size!: number;
  totalElements!: number;
  totalPages!: number;

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.userService.get(0).subscribe(users => {
      let dataTemp: any = users
      this.users = dataTemp.content;

      this.size = dataTemp.size
      this.totalElements = dataTemp.totalElements
      this.totalPages = dataTemp.totalPages
    })
  }

  searchUser(event: Event) {
    this.emailFind = (event.target as HTMLInputElement).value;
    this.emailFind 

    if ( this.emailFind  == "") {
      this.ngOnInit()

    }
    else {
      this.userService.getForEmail(this.emailFind , 0).subscribe(users => {
        let dataTemp: any = users
        this.users = dataTemp.content;

        this.size = dataTemp.size
        this.totalElements = dataTemp.totalElements
        this.totalPages = dataTemp.totalPages

      })
    }
  }

  pageController(event: any) {
    let pageEvent: PageEvent = new PageEvent;
    pageEvent = event

    if (this.emailFind != "") {
      this.userService.getForEmail(this.emailFind, pageEvent.pageIndex).subscribe(users => {
        let dataTemp: any = users
        this.users = dataTemp.content;
      })
    }else{
      this.userService.get(pageEvent.pageIndex).subscribe(users => {
        let dataTemp: any = users
        this.users = dataTemp.content;
      })
    }
  }

  delete(email: string) {
    this.userService.delete(email).subscribe(resp => {
      if(resp)
        this.userService.showMessage("Usuário deletado")
      else
      this.userService.showMessage("Erro deletar")
        this.ngOnInit()
    })


  }

}
