import {Component, Input, Output, EventEmitter} from "@angular/core";
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-checkout-therapy-button',
  templateUrl: 'checkout-therapy-button.html'
})
export class CheckoutTherapyButtonPage {
  @Input() thisStudent: any;
  @Output() checkedOut: EventEmitter<string> = new EventEmitter<string>();

  constructor(public navCtrl: NavController) {}

  checkoutStudent() {
    this.checkedOut.emit(this.thisStudent.title);
  }

}
