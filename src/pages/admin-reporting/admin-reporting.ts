import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CheckinProvider} from '../../providers/checkin-provider'


@Component({
  selector: 'page-admin-reporting',
  templateUrl: 'admin-reporting.html'
})
export class AdminReportingPage {

  constructor(public navCtrl: NavController,
              public checkinService: CheckinProvider){
  }

  ionViewDidLoad() {
    console.log('Hello AdminReportingPage Page');
  }

  exportData(){
    console.log("gonna export here");
  }
}
