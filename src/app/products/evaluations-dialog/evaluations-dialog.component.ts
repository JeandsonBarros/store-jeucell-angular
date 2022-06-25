import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Evaluation } from 'src/app/shared/model/evaluation';
import { Product } from 'src/app/shared/model/product.model';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-evaluations-dialog',
  templateUrl: './evaluations-dialog.component.html',
  styleUrls: ['./evaluations-dialog.component.scss']
})
export class EvaluationsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EvaluationsDialogComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) { }

  starsOfProducts: any =[];
  evaluations!: Evaluation[];
  average = 0;
  percentage = 0;
  product: Product = {
    name: '',
    price: 0,
    category: '',
    description: '',
    imgUrl: '',
    quantity: 0,
    status: ''
  };
  individualStars = [0, 0, 0, 0, 0];
  quantityOfStars = 0;
  mode: ProgressSpinnerMode = 'determinate';

  ngOnInit(): void {
    fetch('http://localhost:8080/products/evaluation/' + this.data).then(response => {
      response.json().then(data => {
        this.evaluations = data

        this.productService.getForId(this.data).subscribe(resp => {
          this.product = resp

          this.evaluations.forEach(data => {
            this.quantityOfStars += data.quantityOfStars
            if (data.quantityOfStars == 1)
              this.individualStars[0] += 1
            else if (data.quantityOfStars == 2)
              this.individualStars[1] += 1
            else if (data.quantityOfStars == 3)
              this.individualStars[2] += 1
            else if (data.quantityOfStars == 4)
              this.individualStars[3] += 1
            else if (data.quantityOfStars == 5)
              this.individualStars[4] += 1
          })

          
          this.evaluations.forEach(temp => {
            let list = [temp, Array(temp.quantityOfStars).fill('star').concat(Array(5 - temp.quantityOfStars).fill('star_border'))]
            this.starsOfProducts.push(list)
          })

          if(this.quantityOfStars / this.evaluations.length > 0)
          {
            this.average = this.quantityOfStars / this.evaluations.length
            this.percentage = ((this.average) / 5) * 100;
          }



        })
      })
    })
  }



  close(): void {
    this.dialogRef.close();
  }

}
