import {Component, Input, Output, EventEmitter} from "@angular/core";
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-action-button',
  templateUrl: 'action-button.html'
})
export class ActionButtonPage {
  selected: boolean;
  @Input() thisStudent: string;
  @Input() userID: number;
  @Input() grandParentPage: string;
  @Input() studentLocation: string;
  @Output() checkedOut: EventEmitter<string> = new EventEmitter<string>();

  constructor(public navCtrl: NavController) {
    this.studentLocation = '';
    this.selected = false;
  }

  checkoutStudent() {
    if(this.grandParentPage === 'signout') {
      this.selected = true;
    }
    this.checkedOut.emit(this.thisStudent);
    //this is where the userID will be linked with thisStudent to to associate who is out with whom
  }

  checkinStudent() {
    this.selected = true;
    this.checkedOut.emit(this.thisStudent);
    //this is where the userID will be linked with thisStudent to to associate who is out with whom
  }

  TNcheckinStudent() {
    this.checkedOut.emit(this.thisStudent + " returned");
  }

  signinDeselectStudent() {
    this.selected = false;
    this.checkedOut.emit(this.thisStudent + ' was removed');
  }

  signoutDeselectStudent() {
    this.selected = false;
    this.checkedOut.emit(this.thisStudent + ' was removed');
  }
}
