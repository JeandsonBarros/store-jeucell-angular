import { ViewProductComponent } from './view-product/view-product.component';
import { SearchComponent } from './search/search.component';
import { CategoryComponent } from './category/category.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './home/products.component';

const routes: Routes = [
  {path: "", component: ProductsComponent},
  {path: "category/:category", component: CategoryComponent},
  {path: "busca/:name", component: SearchComponent},
  {path: "viewproduct/:id", component: ViewProductComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
