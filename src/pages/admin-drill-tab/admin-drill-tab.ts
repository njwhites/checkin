import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the AdminDrillTab page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-admin-drill-tab',
  templateUrl: 'admin-drill-tab.html'
})
export class AdminDrillTabPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello AdminDrillTabPage Page');
  }

}
