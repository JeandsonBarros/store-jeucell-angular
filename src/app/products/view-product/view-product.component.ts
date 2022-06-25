import { Evaluation } from './../../shared/model/evaluation';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductOfCart } from 'src/app/shared/model/ProductOfCart.model';
import { ProductService } from 'src/app/shared/service/product.service';
import { UsersService } from 'src/app/shared/service/users.service';
import { EvaluationsDialogComponent } from 'src/app/products/evaluations-dialog/evaluations-dialog.component';

import { Product } from './../../shared/model/product.model';
import { ShoppingCartService } from './../../shared/service/shopping-cart.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {
  size = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.size = window.innerWidth;
  }
  category = '';
  products!: Product[];
  product: Product = {
    name: '',
    price: 0,
    category: '',
    description: '',
    imgUrl: '',
    quantity: 0,
    status: ''
  };

  favoriteIcon = 'favorite_border';
  cartIcon = 'add_shopping_cart';

  quantity = 1;

  evaluationQuantity = 0;

  progressBar = false;

  options = [
    { value: 1, viewValue: '1 unidade' },
    { value: 2, viewValue: '2 unidades' },
    { value: 3, viewValue: '3 unidades' },
    { value: 4, viewValue: '4 unidades' },
    { value: 5, viewValue: '5 unidades' }
  ];

  productOfCart!: any;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    private shoppingCartService: ShoppingCartService,
    public dialog: MatDialog
  ) { }

  largerQuantity = false;

  formQuantity: FormControl = new FormControl(6, Validators.required);
  starsArray: any;


  ngOnInit(): void {
    this.backToTop();

    let search = '';
    this.route.params.subscribe((params) => {
      search = params['id'];
      this.starsArray = Array(5).fill('star_border');
      this.evaluationQuantity = 0;

      this.productService.getForId(search).subscribe((resp) => {
        this.product = resp;
        this.progressBar = true;

        fetch('http://localhost:8080/products/evaluation/' + search).then(response => {
          response.json().then(data => {
            let evaluations: Evaluation[] = data

            if (evaluations.length > 0) {
              this.evaluationQuantity = evaluations.length

              let average = evaluations.map(data => {
                return data.quantityOfStars;
              }).reduce((total, num) => {
                return total + num;
              })

              average = ((average / evaluations.length));

              this.starsArray = Array(parseFloat(average.toFixed(0))).fill('star');
              this.starsArray = this.starsArray.concat(Array(5 - parseFloat(average.toFixed(0))).fill('star_border'))

              if (average < parseFloat(average.toFixed(0))) {
                this.starsArray[parseFloat(average.toFixed(0)) - 1] = 'star_half';
              }
            }
          })
        })

        this.getFavorites();
        this.isShoshoppingCart();

        this.category = this.product.category;

        this.productService.getCategory(this.category, 0).subscribe((products) => {
          let dataTemp: any = products;
          this.products = dataTemp.content;
        });
      });
    });
  }

  backToTop() {
    window.scroll(0, 0);
  }

  getFavorites() {
    this.userService.getFavorites().subscribe((resp) => {
      this.favoriteIcon = resp.some(product =>
        product.id == this.product.id) ? 'favorite' : 'favorite_border';
    });
  }

  isShoshoppingCart() {
    this.productOfCart = null;

    this.shoppingCartService.getShoshoppingCart().subscribe((resp) => {
      this.productOfCart = resp.find(productInCart => {
        return productInCart.product.id == this.product.id
      })
      this.cartIcon = this.productOfCart? 'remove_shopping_cart' : 'add_shopping_cart';
      
    });
  }

  buy() {
    let productOfCart: ProductOfCart;

    if (!this.productOfCart) {
      //verifica se a quantidade é valida
      if (
        (this.formQuantity.value > 0 || this.quantity > 0) &&
        (this.formQuantity.value <= this.product.quantity ||
          this.quantity <= this.product.quantity)
      ) {
        productOfCart = {
          product: this.product,
          quantity: this.largerQuantity
            ? this.formQuantity.value
            : this.quantity
        };
        this.shoppingCartService
          .postShoshoppingCart(productOfCart)
          .subscribe(() => this.router.navigate(['/cart']));
      } else {
        this.userService.showMessage('Quantidade invalida');
      }
    } else {
      this.router.navigate(['/cart']);
    }
  }

  addShoppingCart() {
    let productOfCart: ProductOfCart;

    if (!this.productOfCart) {
      //verifica se a quantidade é valida
      if (
        (this.formQuantity.value > 0 || this.quantity > 0) &&
        (this.formQuantity.value <= this.product.quantity ||
          this.quantity <= this.product.quantity)
      ) {
        productOfCart = {
          product: this.product,
          quantity: this.largerQuantity
            ? this.formQuantity.value
            : this.quantity
        };

        this.shoppingCartService.postShoshoppingCart(productOfCart).subscribe((resp) => {
          this.userService.showMessage('Adicionado do carrinho');
          this.isShoshoppingCart()
        });
      } else {
        this.userService.showMessage('Quantidade invalida');
      }
    } else {

      this.shoppingCartService.deleteShoshoppingCart(this.productOfCart.id).subscribe(() => {
        this.userService.showMessage('Removido do carrinho');
        this.isShoshoppingCart()
      });
    }
  }

  favorite(product: Product) {
    this.userService.putFavorites(product).subscribe(() => {
      this.getFavorites()
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EvaluationsDialogComponent, {
      width: '38rem',
      height: '30rem',
      data: this.product.id

    });

    dialogRef.afterClosed().subscribe(() => {

    });
  }

}
