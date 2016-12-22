import {Component, Input, Output, EventEmitter} from "@angular/core";
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-checkout-button',
  templateUrl: 'checkout-button.html'
})
export class CheckoutButtonPage {
  @Input() thisStudent: any;
  @Input() userID: number;
  @Output() checkedOut: EventEmitter<string> = new EventEmitter<string>();

  constructor(public navCtrl: NavController) {}

  checkoutStudent() {
    this.checkedOut.emit(this.thisStudent.title);
    //this is where the userID will be linked with thisStudent to to associate who is out with whom
  }

}
