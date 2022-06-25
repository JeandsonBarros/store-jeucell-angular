import { filter } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Evaluation } from 'src/app/shared/model/evaluation';
import { Product } from 'src/app/shared/model/product.model';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-evaluations',
  templateUrl: './evaluations.component.html',
  styleUrls: ['./evaluations.component.scss']
})
export class EvaluationsComponent implements OnInit {

  @Input() product!: Product;

  comment = "";
  productsStars: any;
  starsQuantity = 0;
  starsOfProducts: any = [];
  evaluation!: Evaluation;
  isEvaluated!: boolean;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getEvaluationsByuser();
  }

  getEvaluationsByuser() {
    this.starsOfProducts = Array(5).fill('star_border');
    this.productService.getEvaluationsByUser().subscribe(response => {
      
      this.evaluation = response.body.find((inEvaluations: { id_product: number | undefined; }) => {
       return inEvaluations.id_product == this.product.id
      })
     
      if (this.evaluation) {
        this.starsOfProducts = Array(this.evaluation.quantityOfStars).fill('star').concat(Array(5 - this.evaluation.quantityOfStars).fill('star_border'));
        this.isEvaluated = true;
      }else{
        this.isEvaluated = false;
      }

    })
  }

  starsSafe(star: number) {
    this.starsOfProducts = Array(star + 1).fill("star");
    let border = Array(5 - (star + 1)).fill("star_border");
    this.starsOfProducts =  this.starsOfProducts.concat(border)

    this.starsQuantity = star + 1;

    if (this.isEvaluated)
      this.evaluation.quantityOfStars = star+1
  }

  

  edit() {
    this.productService.editEvaluationProduct(this.evaluation).subscribe(response => {
      this.productService.showMessage(response.body)
    })

  }

  save() {
    let evaluation = {
      id_product: this.product.id,
      comment: this.comment,
      quantityOfStars: this.starsQuantity
    }

    this.productService.evaluationProduct(evaluation).subscribe(response => {
      this.productService.showMessage(response.body)
      this.getEvaluationsByuser()
    })

  }

  delete() {
    this.productService.deleteEvaluationProduct(this.evaluation.id).subscribe(response => {
      this.productService.showMessage(response.body);
      this.getEvaluationsByuser()

    })
  }

}
