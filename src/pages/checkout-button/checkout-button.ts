import {Component, Input, Output, EventEmitter} from "@angular/core";
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-checkout-button',
  templateUrl: 'checkout-button.html'
})
export class CheckoutButtonPage {
  @Input() thisStudent: any;
  @Input() userID: number;
  @Input() grandParentPage: string;
  @Output() checkedOut: EventEmitter<string> = new EventEmitter<string>();

  constructor(public navCtrl: NavController) {}

  //TODO: the click toggle only works for the first element in the list. make it work for all. most likely will need to use thisStudent instead of ID for lookup
  checkoutStudent() {
    this.checkedOut.emit(this.thisStudent.title);
    if(this.grandParentPage === 'signout') {
      var checkoutBtn = document.getElementById('checkoutButton');
      checkoutBtn.style.display = 'none';
      var selectedBtn = document.getElementById('selectedButton');
      selectedBtn.style.display = 'block';
    }
    //this is where the userID will be linked with thisStudent to to associate who is out with whom
  }

  checkinStudent() {
    this.checkedOut.emit(this.thisStudent.title);
    var checkinBtn = document.getElementById('checkinButton');
    checkinBtn.style.display = 'none';
    var selectedBtn = document.getElementById('selectedButton');
    selectedBtn.style.display = 'block';
    //this is where the userID will be linked with thisStudent to to associate who is out with whom
  }

}
