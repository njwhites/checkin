import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {

  constructor(public navCtrl: NavController) {}

  normalizeToday() {
    console.log("time to get normal");
  }

}
