import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ListPage} from "../list/list";

@Component({
  selector: 'page-present-students',
  templateUrl: 'present-students.html'
})
export class PresentStudentsPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello PresentStudentsPage Page');
  }

}
