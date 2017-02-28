import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the ForgotPasswordPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-forgot-password-page',
  templateUrl: 'forgot-password-page.html'
})
export class ForgotPasswordPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello ForgotPasswordPagePage Page');
  }

}
