import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AdminChangePasswordPage} from '../admin-change-password/admin-change-password';
import {AdminChangeQuestionPage} from '../admin-change-question/admin-change-question';

@Component({
  selector: 'page-admin-settings-tab',
  templateUrl: 'admin-settings-tab.html'
})
export class AdminSettingsTabPage {
  id: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.data;
  }

  ionViewDidLoad() {
  }

  sendToChangePassword(){
    this.navCtrl.push(AdminChangePasswordPage, {
      userID: this.id
    });
  }

  toGlobalVariables(){

  }

  normalize(){

  }

  sendToChangeQuestion(){
    this.navCtrl.push(AdminChangeQuestionPage,{
      userID: this.id
    });
  }

}
