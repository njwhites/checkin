import {Component} from "@angular/core";
import {NavController} from "ionic-angular";

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
