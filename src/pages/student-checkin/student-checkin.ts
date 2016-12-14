import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-student-checkin',
  templateUrl: 'student-checkin.html'
})
export class StudentCheckinPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello StudentCheckinPage Page');
  }

}
