import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home-button',
  templateUrl: 'home-button.html'
})
export class HomeButtonPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello HomeButtonPage Page');
  }

  homeButtonClicked(){
    //this.navCtrl.parent.parent gets us the navCtrl for
    // the page encompassing the tabs, and so poping to
    // root on that will take you to the original root
    // page of the app
    // console.log(this.navCtrl.parent.parent);
    // console.log(this.navCtrl.parent.parent.parent);
    this.navCtrl.parent.parent.popToRoot();
  }


}
