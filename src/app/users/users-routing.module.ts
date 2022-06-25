import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserDataComponent } from './user-data/user-data.component';
import { OrderedProductsComponent } from './ordered-products/ordered-products.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../shared/service/auth-guard.service';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  
  {path: "register", component: RegisterComponent},

  {path: "change-password", component: ChangePasswordComponent},

  {path: "requests", component: OrderedProductsComponent,
  canActivate: [AuthGuardService]},

  {path: "data", component: UserDataComponent,
  canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class UsersRoutingModule { }
