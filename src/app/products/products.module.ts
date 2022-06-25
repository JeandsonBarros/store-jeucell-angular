import { CommonModule, registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



import { CategoryComponent } from './category/category.component';
import { ProductsComponent } from './home/products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { SearchComponent } from './search/search.component';
import { MatGridListModule } from '@angular/material/grid-list';

import localePt from '@angular/common/locales/pt';
import { ViewProductComponent } from './view-product/view-product.component';
import { EvaluationsDialogComponent } from './evaluations-dialog/evaluations-dialog.component';
import { ProductCardComponent } from './product-card/product-card.component';

registerLocaleData(localePt);



@NgModule({
  declarations: [
    ProductsComponent,
    CategoryComponent,
    SearchComponent,
    ViewProductComponent,
    EvaluationsDialogComponent,
    ProductCardComponent
    
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatGridListModule,
    MatDividerModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
   
 
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'pt-BR'
  }]
 
 
 
})
export class ProductsModule { }
