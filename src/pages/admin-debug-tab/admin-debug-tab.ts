import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {UtilityProvider} from '../../providers/utility-provider';


/*
  Generated class for the AdminDebugTab page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-admin-debug-tab',
  templateUrl: 'admin-debug-tab.html'
})
export class AdminDebugTabPage {

  constructor(public navCtrl: NavController, public utilityService: UtilityProvider) {}

  ionViewDidLoad() {
  }

  normalizeToday() {
    console.log("time to get normal");
    this.utilityService.resetToday();
  }

  homeButtonClicked(){
    console.log("home button clicked");
    this.navCtrl.parent.parent.popToRoot();
  }


}
