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

/*******************************************************************************
 * checkoutStudent
 *
 * used for denoting a student has been checkout from the therapist or generic
 * perspective
 *
 **/
  checkoutStudent() {
    if(this.grandParentPage === 'signout') {
      this.selected = true;
    }
    this.checkedOut.emit(this.thisStudent);
  }
/*******************************************************************************
 * checkinStudent
 *
 * used for denoting a student has been selected for checking in or checking out
 *
 **/
  checkinStudent() {
    this.selected = true;
    this.checkedOut.emit(this.thisStudent);
  }

/*******************************************************************************
 * TNcheckinStudent
 *
 * used for denoting a student has returned from therapist or generic
 *
 **/
  TNcheckinStudent() {
    this.checkedOut.emit(this.thisStudent + " returned");
  }

/*******************************************************************************
 * signinDeselectStudent
 *
 * used for removing student from checkin array
 *
 **/
  signinDeselectStudent() {
    this.selected = false;
    this.checkedOut.emit(this.thisStudent + ' was removed');
  }

/*******************************************************************************
 * signoutDeselectStudent
 *
 * used for removing student from checkout array
 *
 **/
  signoutDeselectStudent() {
    this.selected = false;
    this.checkedOut.emit(this.thisStudent + ' was removed');
  }
}
