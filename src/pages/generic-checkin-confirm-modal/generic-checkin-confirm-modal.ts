import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-generic-checkin-confirm-modal',
  templateUrl: 'generic-checkin-confirm-modal.html'
})
export class GenericCheckinConfirmModalPage {
  nap_subtract: Number;
  student: String;

  constructor(public navCtrl: NavController, private viewCtrl: ViewController, public navParams: NavParams) {
    this.student = this.navParams.get('student');
    this.nap_subtract = 0;
    console.log(this.student);
  }

  submit() {
    let data = { 'returnValue': true };
    this.viewCtrl.dismiss(data);
  }

}
