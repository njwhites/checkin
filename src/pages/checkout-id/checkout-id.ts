import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-checkout-id',
  templateUrl: 'checkout-id.html'
})
export class CheckoutIdPage {
  @Input() parentPage: string;
  @Output() notify: EventEmitter<number> = new EventEmitter<number>();

  constructor(public navCtrl: NavController) {}

  checkUser(userID) {
    var id = Number(userID.value);
    //for testing purposes I will use 123 as the therapist ID
    //for testing purposes I will use 456 as the nurse ID
    if((id == 123 && this.parentPage == 'therapy') || (id == 456 && this.parentPage == 'nurse')) {
      this.notify.emit(id);
    } else {
      this.notify.emit(-1);
    }
  }

}
