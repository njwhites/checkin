import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-admin-change-password',
  templateUrl: 'admin-change-password.html'
})
export class AdminChangePasswordPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
  }

  updatePassword(password, newPassword, reNewPassword){
    console.log("password change form: " + password + " " + newPassword + " " + reNewPassword)
  }
}
