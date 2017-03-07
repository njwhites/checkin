import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';

@Component({
  selector: 'page-reset-token',
  templateUrl: 'reset-token.html'
})
export class ResetTokenPage {
  userEmail: string;
  id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider) {
    this.userEmail = navParams.get('email');
    this.id = navParams.get('id');
    console.log(this.userEmail + " " + this.id);
  }

  ionViewDidLoad() {
    console.log(this.userEmail);
  }

  updatePassword(password, repassword){
    console.log(password.value + repassword.value);
    if(password.value === repassword.value){
      this.authService.setPassword(this.id, password.value).then(() => {
        console.log("Password successfully changed");
        this.navCtrl.popToRoot();
      })
    }
  }

}
