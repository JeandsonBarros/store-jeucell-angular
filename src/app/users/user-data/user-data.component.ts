import { UserShopping } from './../../shared/model/user.model';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/shared/service/users.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {
  hide = true;
  hideOldPassword = true;
  hideNewPassword = true;

  progressBar = false

  panelOpenState = false;

  user: UserShopping = {
    name: "string",
    email: "string",
    birthDate: "string",
    cpf: 0,
    password: "string",
  }

  constructor(private userService: UsersService, private fb: UntypedFormBuilder) { }

  userForm: UntypedFormGroup = this.fb.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    birthDate: [null, [Validators.required]],
    cpf: [null, [Validators.required, Validators.pattern(/^\d{11}$/)]],
    password: [null, [Validators.required]]
  });

  changePassword!: UntypedFormGroup; 


  ngOnInit(): void {
    this.changePassword = this.fb.group({
      oldPassword: [null, [Validators.required, Validators.minLength(8)]],
      newPassword: [null, [Validators.required, Validators.minLength(8)]]
    })

    this.userService.getUserAuthenticated().subscribe(data => {
      this.user = data
      this.progressBar = true
      this.userForm.controls['name'].setValue(this.user.name);
      this.userForm.controls['email'].setValue(this.user.email);
      this.userForm.controls['birthDate'].setValue(this.user.birthDate);
      this.userForm.controls['cpf'].setValue(this.user.cpf);

    })

  }

  validate(form: UntypedFormGroup) {
    let resultErros: any = [];

    Object.keys(form.controls).forEach(key => {

      const controlErrors: any = form.controls[key].errors;
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

    return resultErros;
  }

  changePasswordFunction() {
    
    if (this.validate(this.changePassword).length == 0){
        this.userService.passwordChange(this.user.email, this.changePassword.value).subscribe(response => {
          this.userService.showMessage(response)
          this.panelOpenState = !this.panelOpenState;
          this.ngOnInit()
        })
     }
    else
      this.userService.showMessage("Verifique os campos")
    

  }

  salvar() {

    if (this.validate(this.userForm).length == 0) {
      this.userForm.controls['email'].setValue(this.user.email)
      this.userForm.controls['cpf'].setValue(this.user.cpf)
      this.userService.put(this.userForm.value).subscribe(resp => {

        if (resp)
          this.userService.showMessage("Usuário editado")
        else
          this.userService.showMessage("Erro ao editar")

        this.userForm.controls['password'].setValue("");
      });

    }else{
      this.userService.showMessage("Verifique os campos")
    }


  }
}
