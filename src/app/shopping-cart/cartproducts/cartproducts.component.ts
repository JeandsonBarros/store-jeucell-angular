import { ShoppingCartService } from './../../shared/service/shopping-cart.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from './../../shared/service/users.service';
import { Component, OnInit } from '@angular/core';
import { OrderedService } from 'src/app/shared/service/ordered.service';
import { ProductOfCart } from 'src/app/shared/model/ProductOfCart.model';



@Component({
  selector: 'app-cartproducts',
  templateUrl: './cartproducts.component.html',
  styleUrls: ['./cartproducts.component.scss']
})
export class CartproductsComponent implements OnInit {

  quotas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  productsOfCart!: ProductOfCart[];
  address!: FormGroup;
  payment!: FormGroup;
  cart!: FormGroup;

  checked = false;

  state = "";
  city = "";
  cep!: number;

  total = 0.0;
  progressBar = false
  quantity = 1;

  options = [
    { value: 1, viewValue: "1 unidade" },
    { value: 2, viewValue: "2 unidades" },
    { value: 3, viewValue: "3 unidades" },
    { value: 4, viewValue: "4 unidades" },
    { value: 5, viewValue: "5 unidades" },
  ]

  constructor(
    private userService: UsersService,
    private orderedService: OrderedService,
    private shoppingCartService: ShoppingCartService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  largerQuantity = false;

  formQuantity = new FormControl(1, Validators.required)

  ngOnInit(): void {


    this.shoppingCartService.getShoshoppingCart().subscribe(products => {
      let dataTemp: any = products
      this.productsOfCart = products
      this.progressBar = true

      this.cart = this.fb.group({
        productsSelect: [this.productsOfCart.length == 0 ? null : true, [Validators.required]]
      })

      this.total = 0.0
      dataTemp.forEach((product: { total: number }) => {
        this.total += product.total
      })

    })

    this.address = this.fb.group({
      remittee: [null, [Validators.required]],
      remitteeNumber: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      district: [null, [Validators.required]],
      cep: [null, [Validators.required]],
      street: [null, [Validators.required]],
      numberHouse: [null, [Validators.required]]
    });

    this.payment = this.fb.group({
      quota: [null, [Validators.required]],
      nameOnCard: [null, [Validators.required]],
      cardNumber: [null, [Validators.required, Validators.pattern(/^(\d{4}\ ){3}\d{4}$/)]],
      expirationCard: [null, [Validators.required, Validators.pattern(/^\d{2}\/\d{4}$/)]],
      cvv: [null, [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });

  }

  quantityProduct(productOfCart: ProductOfCart, event: Event) {
    let value = (event.target as HTMLInputElement).value;
    var y: number = +value;

    productOfCart.quantity = y

    if (y >= 1 && y <= productOfCart.product.quantity) {
      this.cart.controls['productsSelect'].setValue(true)
      this.shoppingCartService.putShoshoppingCart(productOfCart).subscribe(() => {
      })
    } else if (y > productOfCart.product.quantity) {
      this.cart.controls['productsSelect'].setValue(null)
      this.userService.showMessage("Quantidade acima do limite")
    } else {
      this.cart.controls['productsSelect'].setValue(null)
      this.userService.showMessage("Quantidade invalida")
    }
  }


  getCep(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    if (filterValue.length == 8) {
      //Dica de fetch api: https://www.javascripttutorial.net/javascript-fetch-api/
      //Mais dicas: https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data-pt
      fetch("https://viacep.com.br/ws/" + filterValue + "/json/")
        .then(response => {
          response.json()
            .then(result => {
              this.city = result.uf
              this.state = result.localidade
            })
        })
        .catch(function (err) {

        });
    }
  }



  shoppingCart(productOfCart: any) {

    this.shoppingCartService.deleteShoshoppingCart(productOfCart.id).subscribe(() => {
      this.ngOnInit()
    })

  }

  ask() {
    let resultErros: any = [];

    Object.keys(this.payment.controls).forEach(key => {

      const controlErrors: any = this.payment.controls[key].errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          resultErros.push({
            'control': key,
            'error': keyError,
            'value': controlErrors[keyError]
          });
        });
      }
    });


    if (resultErros.length == 0) {
      let ordered = { ...(this.address.value), ...(this.payment.value), "city": this.city, "state": this.state }


      this.orderedService.postOrdered(ordered).subscribe(data => {
        if (data) {
          this.userService.showMessage("Pedido feito")
          this.router.navigate(["user/requests"])
        } else {
          this.userService.showMessage("Falha!")
        }
      }
      )
    }else{
      this.userService.showMessage("Verifique os campos")
    }
  }

}
