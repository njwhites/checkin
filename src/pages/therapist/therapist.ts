import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-therapist',
  templateUrl: 'therapist.html'
})
export class TherapistPage {
  id: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.data;
    console.log(this.id);
  }

}
