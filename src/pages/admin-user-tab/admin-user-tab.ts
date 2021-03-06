import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider'
import { AdminUserModalPage } from '../admin-user-modal/admin-user-modal';

@Component({
  selector: 'page-admin-user-tab',
  templateUrl: 'admin-user-tab.html'
})
export class AdminUserTabPage {

  roleSelection;
  id: string;

  constructor(public navCtrl: NavController,
              public userService: UserProvider,
              public navParams: NavParams) {
    this.id = navParams.data;
    this.roleSelection = this.userService.ROLES[1];
  }

  ionViewDidLoad() {
  }

  homeButtonClicked(){
    //this.navCtrl.parent.parent gets us the navCtrl for
    // the page encompassing the tabs, and so poping to
    // root on that will take you to the original root
    // page of the app
    this.navCtrl.parent.parent.popToRoot();
  }

  userClicked(ID: String){
    this.navCtrl.push(AdminUserModalPage, {key: ID, admin_id: this.id});
  }

  addUser(){
    this.navCtrl.push(AdminUserModalPage, {key: "-1", admin_id: this.id});
  }
}
