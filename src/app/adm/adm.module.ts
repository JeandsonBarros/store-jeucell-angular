import { ListUsersComponent } from './list-users/list-users.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';


import { AdmRoutingModule } from './adm-routing.module';
import { DialogComponent } from './dialog/dialog.component';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { NavComponent } from './nav/nav.component';
import { OrderedComponent } from './ordered/ordered.component';
import { ProductsComponent } from './products/products.component';


@NgModule({
  declarations: [
    ProductsComponent,
    OrderedComponent,
    NavComponent,
    DialogComponent,
    FormDialogComponent,
    ListUsersComponent
   
    
  ],
  imports: [
    CommonModule,
    AdmRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    NgxMatFileInputModule,
    MatCardModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatProgressBarModule,
   
    
  ]
})
export class AdmModule { }
