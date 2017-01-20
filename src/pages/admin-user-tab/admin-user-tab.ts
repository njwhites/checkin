import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {UserProvider} from '../../providers/user-provider'

/*
  Generated class for the AdminUserTab page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-admin-user-tab',
  templateUrl: 'admin-user-tab.html'
})
export class AdminUserTabPage {

  constructor(public navCtrl: NavController, public userService: UserProvider) {}

  ionViewDidLoad() {
  }

  homeButtonClicked(){
    console.log("home button clicked");
    this.navCtrl.parent.parent.popToRoot();
  }
}
