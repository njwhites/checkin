import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";

@Component({
  selector: 'page-nap',
  templateUrl: 'nap.html'
})
export class NapPage {
  roomNumber: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.roomNumber = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('this.roomNumber');
  }

}
