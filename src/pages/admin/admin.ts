import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UtilityProvider} from '../../providers/utility-provider'

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {

  constructor(public navCtrl: NavController, public utilityService: UtilityProvider) {}

  normalizeToday() {
    console.log("time to get normal");
    this.utilityService.resetToday();
  }

}
