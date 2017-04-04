import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TherapistPage} from "../therapist/therapist";
import {TherapistLogPage} from "../therapist-log/therapist-log";


@Component({
  selector: 'page-therapist-tabs',
  templateUrl: 'therapist-tabs.html'
})
export class TherapistTabsPage {
  tab0 = TherapistPage;
  tab1 = TherapistLogPage;
  id: Number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.data;
  }

  ionViewDidLoad() {
    console.log('Hello TherapistTabsPage Page');
  }

}
