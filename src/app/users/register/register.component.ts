import { Router } from '@angular/router';
import { UsersService } from './../../shared/service/users.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;
  userForm!: UntypedFormGroup;
  
  constructor(private userService: UsersService, private fb: UntypedFormBuilder, private route: Router) { }

  ngOnInit(): void {

    if (this.userService.isAuth())
      this.route.navigate([''])

    this.userForm = this.fb.group({

      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      birthDate: [null, [Validators.required]],
      cpf: [null, [Validators.required, Validators.pattern(/^\d{11}$/)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  salvar() {

    let resultErros: any = [];

    Object.keys(this.userForm.controls).forEach(key => {

      const controlErrors: any = this.userForm.controls[key].errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          resultErros.push({
            'control': key,
            'error': keyError,
            'value': controlErrors[keyError]
          });
        });
      }
    });


    if (resultErros.length == 0) {
    
      this.userService.post(this.userForm.value).subscribe(response => {
        
        this.route.navigate(['/user/login']);
        this.userService.showMessage(response);

      });
    } else {
      this.userService.showMessage("Verifique os campos")
    }
  }
}
