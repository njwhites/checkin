import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider'

@Component({
  selector: 'page-admin-change-password',
  templateUrl: 'admin-change-password.html'
})
export class AdminChangePasswordPage {
  id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider) {
    this.id = navParams.get("userID") + "";
  }

  ionViewDidLoad() {
  }

  updatePassword(password, newPassword, reNewPassword){
  	this.authService.checkPassword(this.id, password).then((success) => {
  		if(success){
  			this.authService.setPassword(this.id, newPassword);
  		}
  	})
    console.log("id: " + this.id);
    console.log("password change form: " + password + " " + newPassword + " " + reNewPassword)
  }
}
