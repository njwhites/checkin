import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the TherapistAdd page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-therapist-add',
  templateUrl: 'therapist-add.html'
})
export class TherapistAddPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello TherapistAddPage Page');
  }

}
