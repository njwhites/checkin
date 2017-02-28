import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ResetTokenPage} from '../reset-token/reset-token';

@Component({
  selector: 'page-forgot-password-page',
  templateUrl: 'forgot-password-page.html'
})
export class ForgotPasswordPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello ForgotPasswordPagePage Page');
  }

  sendToken(userEmail){
    this.navCtrl.push(ResetTokenPage, {
      email: userEmail
    })
  }

}
