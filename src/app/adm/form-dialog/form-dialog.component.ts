import { Product } from './../../shared/model/product.model';
import { ProductService } from './../../shared/service/product.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

interface Category {
  value: String;
  viewValue: String;
}

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss']
})
export class FormDialogComponent implements OnInit {

  titleOption = "";
  file!: File

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    private service: ProductService,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Product,
  ) { }

  productForm: UntypedFormGroup = this.fb.group({});

  categotys: Category[] = [
    { value: "Smartphones", viewValue: "Smartphones" },
    { value: "Acessórios-para-smartphones", viewValue: "Acessórios para smartphones" },
    { value: "Perifericos-para-computador", viewValue: "Perifericos para computador" },
    { value: "Aparelhos-de-som", viewValue: "Aparelhos de som" }
  ]

  status = ["Disponível", "Indisponível"];

  progressStatus: Observable<number> =  this.service.progress;
  asProgress = false;


  ngOnInit(): void {

    this.progressStatus.subscribe(data => {
      this.asProgress = true;
      
      if(data == 100){
        this.close();
        this.productForm.reset();
        this.asProgress = false;
      }

    })

    this.titleOption = this.data.id == null ? "Adicionar produto" : "Editar produto";

    this.productForm = this.fb.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required]],
      price: [this.data.price, [Validators.required]],
      category: [this.data.category, [Validators.required]],
      description: [this.data.description, [Validators.required]],
      status: [this.data.status, [Validators.required]],
      quantity: [this.data.quantity, [Validators.required]],
      

    });


  }

  close(): void {
    this.dialogRef.close();
    this.productForm.reset();
  }

  action(): void {
    this.data.id == null ? this.save() : this.edit();

  }

  edit(): void {
    let dataPut = {imgName: this.data.imgName, imgUrl: this.data.imgUrl, ...(this.productForm.value)};
    this.service.upPut(dataPut, this.file)
    

  }

  save(): void {
    this.service.up(this.productForm.value, this.file)
    
  }

}
