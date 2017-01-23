import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider'
import { AdminUserModalPage } from '../admin-user-modal/admin-user-modal';

@Component({
  selector: 'page-admin-user-tab',
  templateUrl: 'admin-user-tab.html'
})
export class AdminUserTabPage {

  constructor(public navCtrl: NavController,
              public userService: UserProvider) {}

  ionViewDidLoad() {
  }

  homeButtonClicked(){
    console.log("home button clicked");
    this.navCtrl.parent.parent.popToRoot();
  }

  userClicked(ID: String){
    this.navCtrl.push(AdminUserModalPage, {key: ID});
  }

  addUser(){
    this.navCtrl.push(AdminUserModalPage, {key: "-1"});
  }
}
