import {Component, Input, Output, EventEmitter} from "@angular/core";
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-action-button',
  templateUrl: 'action-button.html'
})
export class ActionButtonPage {
  @Input() thisStudent: string;
  @Input() userID: number;
  @Input() grandParentPage: string;
  @Output() checkedOut: EventEmitter<string> = new EventEmitter<string>();

  constructor(public navCtrl: NavController) {}

  //TODO: the click toggle only works for the first element in the list. make it work for all. most likely will need to use thisStudent instead of ID for lookup
  checkoutStudent() {
    if(this.grandParentPage === 'signout') {
      var checkoutBtn = document.getElementById('checkoutButton_' + this.thisStudent);
      var selectedBtn = document.getElementById('selectedButton_' + this.thisStudent);
      checkoutBtn.style.display = 'none';
      selectedBtn.style.display = 'block';
    }
    this.checkedOut.emit(this.thisStudent);
    //this is where the userID will be linked with thisStudent to to associate who is out with whom
  }

  checkinStudent() {
    var checkinBtn = document.getElementById('checkinButton_' + this.thisStudent);
    var selectedBtn = document.getElementById('selectedButton_' + this.thisStudent);
    checkinBtn.style.display = 'none';
    selectedBtn.style.display = 'block';
    this.checkedOut.emit(this.thisStudent);
    //this is where the userID will be linked with thisStudent to to associate who is out with whom
  }

  deselectStudent() {
    var checkoutBtn = document.getElementById('checkoutButton_' + this.thisStudent);
    var checkinBtn = document.getElementById('checkinButton_' + this.thisStudent);
    var selectedBtn = document.getElementById('selectedButton_' + this.thisStudent);
    if(checkinBtn === null) {
      if(checkoutBtn.style.display = 'none') {
        checkoutBtn.style.display = 'block';
        selectedBtn.style.display = 'none';
      }
    } else if(checkoutBtn === null) {
      if(checkinBtn.style.display = 'none') {
        checkinBtn.style.display = 'block';
        selectedBtn.style.display = 'none';
      }
    }


    this.checkedOut.emit(this.thisStudent + ' was removed');
  }

}
