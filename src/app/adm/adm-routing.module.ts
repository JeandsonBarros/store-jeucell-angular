import { ListUsersComponent } from './list-users/list-users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderedComponent } from './ordered/ordered.component';
import { ProductsComponent } from './products/products.component';


const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "produtos" },
  { path:"produtos", component: ProductsComponent },
  { path:"pedidos", component: OrderedComponent },
  { path:"usuarios", component: ListUsersComponent },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmRoutingModule { }
