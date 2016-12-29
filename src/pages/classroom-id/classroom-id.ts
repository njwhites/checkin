import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-classroom-id',
  templateUrl: 'classroom-id.html'
})
export class ClassroomIdPage {
  @Input() parentPage: string;
  @Output() notify: EventEmitter<number> = new EventEmitter<number>();

  constructor(public navCtrl: NavController) {}

  //for testing purposes I will use 123 as the therapist ID
  //for testing purposes I will use 456 as the nurse ID
  //for testing purposes I will use 789 as the signout ID and signin ID
  //for testing purposes I will use ids between 1000 and 5000 for therapy or admin
  checkUser(userID) {
    var id = Number(userID.value);
    //I split up inputs so we can eventually look to see if each userId is authorized for the transaction
    if(id === 123 && this.parentPage === 'therapy') {
      this.notify.emit(id);
    } else if(id === 456 && this.parentPage === 'nurse') {
      this.notify.emit(id);
    } else if(id === 789 && this.parentPage === 'signout') {
      this.notify.emit(id);
    } else if(id === 789 && this.parentPage === 'checkin') {
      this.notify.emit(id);
    } else if(id >= 1000 && id <= 5000 && this.parentPage === 'kitchen') {
      this.notify.emit(id);
    } else if(id >= 1000 && id <= 5000 && this.parentPage === 'therapist') {
      this.notify.emit(id);
    } else if(id >= 1000 && id <= 5000 && this.parentPage === 'admin') {
      this.notify.emit(id);
    } else {
      this.notify.emit(-1);
    }
    userID.value = '';
  }

}
