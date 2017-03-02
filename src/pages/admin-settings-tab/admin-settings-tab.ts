import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AdminChangePasswordPage} from '../admin-change-password/admin-change-password';

@Component({
  selector: 'page-admin-settings-tab',
  templateUrl: 'admin-settings-tab.html'
})
export class AdminSettingsTabPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
  }

  sendToChangePassword(){
    this.navCtrl.push(AdminChangePasswordPage);
  }

}
