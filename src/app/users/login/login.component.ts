import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsersService } from './../../shared/service/users.service';
import { Component, OnInit } from '@angular/core';
import { loga } from 'src/app/shared/model/loga';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  
})
export class LoginComponent implements OnInit {
  hide = true;
 
  login!: UntypedFormGroup;
  
  constructor(private serviceUser: UsersService, private fb: UntypedFormBuilder, private router: Router) { }

  ngOnInit(): void {
    
    if(this.serviceUser.isAuth())
       this.router.navigate([''])

    this.login = this.fb.group({
      email:["", [Validators.required]],
      password: ["", [Validators.required]]
    })
  }

  

  logar(){
    
    this.serviceUser.logar(this.login.value)
  
  }

}
