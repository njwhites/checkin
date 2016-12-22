import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-checkout-id',
  templateUrl: 'checkout-id.html'
})
export class CheckoutIdPage {
  @Input() parentPage: string;
  @Output() notify: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(public navCtrl: NavController) {}

  checkUser(userID) {
    var id = Number(userID.value);
    //for testing purposes I will use 123 as the therapist ID
    if(id == 123 && this.parentPage == 'therapy') {
      this.notify.emit(true);
    } else {
      this.notify.emit(false);
    }
  }

}
