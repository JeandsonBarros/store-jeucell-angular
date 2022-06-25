
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './shared/service/auth-guard.service';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "products" },
  {
    path: "products",
    loadChildren: () => import("./products/products.module").then(m => m.ProductsModule)
  },
  {
    path: "user",
    loadChildren: () => import("./users/users.module").then(m => m.UsersModule)
  },
  {
    path: "cart",
    loadChildren: () => import("./shopping-cart/shopping-cart.module").then(m => m.ShoppingCartModule),
    canActivate: [AuthGuardService]
  },
  {
    path: "adm",
    loadChildren: () => import("./adm/adm.module").then(m => m.AdmModule),
    canActivate: [AuthGuardService]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
