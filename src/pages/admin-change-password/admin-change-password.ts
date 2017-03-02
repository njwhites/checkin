import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-admin-change-password',
  templateUrl: 'admin-change-password.html'
})
export class AdminChangePasswordPage {
  id: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.get("userID");
  }

  ionViewDidLoad() {
  }

  updatePassword(password, newPassword, reNewPassword){
    console.log("id: " + this.id);
    console.log("password change form: " + password + " " + newPassword + " " + reNewPassword)
  }
}
