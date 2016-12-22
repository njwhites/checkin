import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-therapy',
  templateUrl: 'therapy.html'
})
export class TherapyPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello TherapyPage Page');
  }

}
