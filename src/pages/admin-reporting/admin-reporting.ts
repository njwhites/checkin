import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CheckinProvider} from '../../providers/checkin-provider'
import {BillingProvider} from '../../providers/billing-provider'


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
    var date = new Date();
    while(date.getDay() !== 1){
      date.setDate(date.getDate()-1);
    }
    console.log(date);
    this.checkinService.writeBillingWeek(date,"102");
  }
}
