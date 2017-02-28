import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-reset-token',
  templateUrl: 'reset-token.html'
})
export class ResetTokenPage {
  userEmail: String;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userEmail = navParams.get('email').value;
  }

  ionViewDidLoad() {
    console.log(this.userEmail);
  }

  updatePassword(password, repassword){
    console.log(password.value + repassword.value);
  }

}
