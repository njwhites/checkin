import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the StudentCheckinConfirm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-student-checkin-confirm',
  templateUrl: 'student-checkin-confirm.html'
})
export class StudentCheckinConfirmPage {
  selectedStudents: any;
  room: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selectedStudents = navParams.get('students');
    this.room = navParams.get('room');
  }

  ionViewDidLoad() {
    console.log('Hello StudentCheckinConfirmPage Page');
  }

  checkInCompleted() {
    console.log("check in done");
    this._persistCheckin();
    //can pop twice, would probably need custom animation to make it not look bad
    // this.navCtrl.pop();
    // this.navCtrl.pop();
    this.navCtrl.popToRoot();
  }

  //DB code goes here
  _persistCheckin(){
    console.log(`Checked into ${this.room}`);
    console.log(this.selectedStudents);
  }

}
