import { catchError, of } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../shared/service/users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-send-email',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  progress = true;
  hideOldPassword = true;
  hideNewPassword = true;

  sendEmailCompleted = false;
  sendCodeCompleted = false;
  sendNewPasswordCompleted = false;

  emailControl = new UntypedFormControl('', Validators.required);

  codeControl = new UntypedFormControl('', Validators.required);

  constructor(private serviceUser: UsersService, private router: Router, private fb: UntypedFormBuilder) { }

  changePassword!: UntypedFormGroup;


  ngOnInit(): void {

    this.changePassword = this.fb.group({
      newPassword: [null, [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: [null, [Validators.required, Validators.minLength(8)]]
    })

  }

  sendEmail() {

    this.progress = false;

    this.serviceUser.sendEmail(this.emailControl.value).pipe(
      catchError(erro => {
        this.serviceUser.showMessage(erro.error)
        this.progress = true
        return of();
      })
    ).subscribe(response => {

      this.progress = true
      this.serviceUser.showMessage(response.body)

      if (response.status == 200) {
        this.sendEmailCompleted = true
      }
    })

  }

  sendCode() {

    this.serviceUser.sendCode(this.codeControl.value).pipe(
      catchError(erro => {
        this.serviceUser.showMessage(erro.error)
        return of();
      })
    ).subscribe(response => {
      this.serviceUser.showMessage(response.body)
      if (response.status == 200) {
        this.sendCodeCompleted = true
      }
    })

  }

  sendNewPasswor() {
    let change: Object = {
      email: this.emailControl.value,
      ...(this.changePassword.value),
      code: this.codeControl.value
    }

    this.serviceUser.sendNewPasswor(change).pipe(
      catchError(erro => {
        this.serviceUser.showMessage(erro.error)
        return of();
      })
    ).subscribe(response => {
      this.serviceUser.showMessage(response.body)
      if (response.status == 202) {
        this.sendNewPasswordCompleted = true;
        this.router.navigate(['/user/login']);
      }
    })
  }

  resetChangePassword() {
    this.sendCodeCompleted = false
    this.sendEmailCompleted = false
  }

}
