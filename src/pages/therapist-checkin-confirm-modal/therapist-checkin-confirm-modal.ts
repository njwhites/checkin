import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-therapist-checkin-confirm-modal',
  templateUrl: 'therapist-checkin-confirm-modal.html'
})
export class TherapistCheckinConfirmModalPage {

  constructor(public navCtrl: NavController, private viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('Hello TherapistCheckinConfirmModalPage Page');
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

}
