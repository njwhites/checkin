import {Component, Input} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-nap-buttons',
  templateUrl: 'nap-buttons.html'
})
export class NapButtonsPage {
  time: string = "60";
  @Input() thisStudent: any;

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello NapButtonsPage Page');
  }

}
