import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the TherapistStudentDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-therapist-student-details',
  templateUrl: 'therapist-student-details.html'
})
export class TherapistStudentDetailsPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello TherapistStudentDetailsPage Page');
  }

}
