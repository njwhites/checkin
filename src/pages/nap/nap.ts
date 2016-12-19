import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Nap page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-nap',
  templateUrl: 'nap.html'
})
export class NapPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello NapPage Page');
  }

}
