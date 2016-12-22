import {Component, Input} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-checkout-id',
  templateUrl: 'checkout-id.html'
})
export class CheckoutIdPage {
  @Input() parentPage: string;

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello CheckoutIdPage Page');
  }

  checkUser(userID) {
    var id = Number(userID.value);
    //for testing purposes I will use 123 as the therapist ID
    if(id == 123 && this.parentPage == 'therapy') {

    }
  }

}
