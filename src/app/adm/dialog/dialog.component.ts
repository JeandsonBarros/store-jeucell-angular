import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogComponent } from 'src/app/adm/form-dialog/form-dialog.component';
import { Product } from 'src/app/shared/model/product.model';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  
})
export class DialogComponent implements OnInit {
  state = "closed"
  mostra = false
  product: Product = {
    name: "",
    price: 0,
    category: "",
    description: "",
    imgUrl: "",
    quantity: 0,
    status: ""
  }


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      width: '18rem',
      data: this.product,

    });

    dialogRef.afterClosed().subscribe(() => {

    });
  }

  
}
