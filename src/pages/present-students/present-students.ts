import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-present-students',
  templateUrl: 'present-students.html'
})
export class PresentStudentsPage {
  roomNumber: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.roomNumber = navParams.data;
  }

  ionViewDidLoad() {
    console.log(this.roomNumber);
  }

}
