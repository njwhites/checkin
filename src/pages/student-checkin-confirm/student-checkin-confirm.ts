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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(`Meow ${navParams.get('students')}`);
    this.selectedStudents = navParams.get('students');
  }

  ionViewDidLoad() {
    console.log('Hello StudentCheckinConfirmPage Page');
  }

  checkInCompleted() {
    console.log("check in done");
    this.navCtrl.popToRoot();
  }

}
