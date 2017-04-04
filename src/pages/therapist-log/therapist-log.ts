import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the TherapistLog page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-therapist-log',
  templateUrl: 'therapist-log.html'
})
export class TherapistLogPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello TherapistLogPage Page');
  }

}
